<?php

namespace App\Services;

/**
 * ABC Body Formatter
 * ==================
 * Normalizes ABC notation bodies to 4 measures per line,
 * handling anacrusis (pickup bars), repeat barlines,
 * first/second endings, and various time signatures.
 *
 * Ported from the legacy CollectionParserHelper.php.
 */
class AbcBodyFormatter
{
    /**
     * Format an ABC body to 4 measures per line.
     *
     * @param string $abcBody  Raw ABC notation body (after K: line)
     * @param string $timeSignature  e.g. "4/4", "6/8", "3/4"
     * @param string $defaultNoteLength  e.g. "1/8", "1/4"
     * @return string  Formatted ABC body
     */
    public function format(string $abcBody, string $timeSignature = '4/4', string $defaultNoteLength = '1/8'): string
    {
        // Clean up input
        $abcBody = preg_replace('/\|\\\\\n/', '|', $abcBody);   // strip |\ continuations
        $abcBody = preg_replace('/\\\\\n/', ' ', $abcBody);      // strip \ continuations
        $abcBody = preg_replace('/\n\s*\n/', "\n", $abcBody);   // remove blank lines
        $abcBody = trim($abcBody);

        // Normalise ending markers to [1 and [2
        $abcBody = str_replace('|1', '|[1', $abcBody);
        $abcBody = str_replace('|2', '|[2', $abcBody);

        // Calculate beats per measure in eighth notes
        $beatsPerMeasure = 8;
        if (preg_match('/^(\d+)\/(\d+)$/', $timeSignature, $m)) {
            $beatsPerMeasure = (int) $m[1] * (8 / (int) $m[2]);
        }

        // Protect [1 and [2 from the barline splitter
        $abcBody = str_replace('[2', 'SECONDENDING', $abcBody);
        $abcBody = str_replace('[1', 'FIRSTENDING', $abcBody);

        // Split on barlines, keeping the delimiters
        $parts = preg_split('/(\|\|:|\|\||:\|:|\|2|\|1|::|:\||\|\]|\|:|\|)/', $abcBody, -1, PREG_SPLIT_DELIM_CAPTURE);

        // Pair content with its following barline, restoring ending markers
        $bars = [];
        $pendingPrefixBarline = '';
        for ($i = 0; $i < count($parts); $i += 2) {
            $content = trim($parts[$i]);
            $barline = isset($parts[$i + 1]) ? $parts[$i + 1] : '';
            $content = str_replace('SECONDENDING', '[2', $content);
            $content = str_replace('FIRSTENDING', '[1', $content);

            if ($content === '' && in_array($barline, ['|:', '||:'], true)) {
                $pendingPrefixBarline = $barline;
                continue;
            }

            if ($pendingPrefixBarline !== '' && $content !== '') {
                $content = $pendingPrefixBarline . $content;
                $pendingPrefixBarline = '';
            }

            if ($content !== '') {
                $bars[] = ['content' => $content, 'barline' => $barline];
            }
        }

        if ($pendingPrefixBarline !== '') {
            $bars[] = ['content' => $pendingPrefixBarline, 'barline' => ''];
        }

        if (empty($bars)) {
            return $abcBody;
        }

        // Line building state
        $lines = [];
        $currentLine = '';
        $barCount = 0;
        $inFirstEnding = false;

        $repeatBarlines = ['||:', ':|:', '::', ':|', '|:'];
        $startRepeatBarlines = ['||:', '|:'];
        $firstEndingBarlines = ['|1', '[1'];
        $secondEndingBarlines = ['[2', '|2'];

        // Flush current line to output, optionally carrying start-repeat forward
        $flushCurrentLine = function (bool $carryStartRepeatForward = true) use (&$lines, &$currentLine, &$barCount) {
            $line = trim($currentLine);

            if ($line === '') {
                $currentLine = '';
                $barCount = 0;
                return;
            }

            $carryForward = '';
            if ($carryStartRepeatForward) {
                if (preg_match('/^(.*?)(\|\|:|\|:)$/', $line, $matches)) {
                    $line = trim($matches[1]);
                    $carryForward = $matches[2];
                } elseif (preg_match('/^(.*?)(::|:\|:)$/', $line, $matches)) {
                    $line = trim($matches[1]) . ':|';
                    $carryForward = ':';
                }
            }

            if ($line === ':' && $carryForward === '') {
                $currentLine = ':';
                $barCount = 0;
                return;
            }

            if ($line !== '') {
                $lines[] = $line;
            }

            $currentLine = $carryForward;
            $barCount = 0;
        };

        // Pre-calculate second ending lengths
        $secondEndingSizes = [];
        for ($i = 0; $i < count($bars); $i++) {
            if (in_array(trim($bars[$i]['barline']), $firstEndingBarlines) || str_starts_with($bars[$i]['content'], '[1')) {
                $size = 0;
                for ($j = $i + 1; $j < count($bars); $j++) {
                    if (in_array(trim($bars[$j]['barline']), $secondEndingBarlines) || str_starts_with($bars[$j]['content'], '[2')) {
                        for ($k = $j; $k < count($bars); $k++) {
                            $size++;
                            $bl = trim($bars[$k]['barline']);
                            if (in_array($bl, ['||', '|]', ':|', ':|:']) || $bl === '') {
                                break;
                            }
                        }
                        break;
                    }
                }
                $secondEndingSizes[$i] = $size;
            }
        }

        // Build lines — 4 bars per line with special handling for endings and repeats
        foreach ($bars as $index => $bar) {
            $nextBar = isset($bars[$index + 1]) ? $bars[$index + 1] : null;
            $thisBeats = $this->countBeats($bar['content'], $defaultNoteLength);
            $nextBeats = $nextBar ? $this->countBeats($nextBar['content'], $defaultNoteLength) : 0;

            $isAnacrusisBar = ($thisBeats < $beatsPerMeasure * 0.75) && ($nextBeats >= $beatsPerMeasure * 0.75);
            $isRepeatBarline = in_array(trim($bar['barline']), $repeatBarlines);
            $isStartRepeatBarline = in_array(trim($bar['barline']), $startRepeatBarlines);
            $isFirstEndingStart = in_array(trim($bar['barline']), ['|1']) || str_starts_with($bar['content'], '[1');
            $isSecondEndingStart = in_array(trim($bar['barline']), ['|2']) || str_starts_with($bar['content'], '[2');

            if ($isAnacrusisBar && trim($currentLine) !== '') {
                $flushCurrentLine();
            }

            $currentLine .= $bar['content'];

            if (! empty($bar['barline'])) {
                $currentLine .= $bar['barline'];

                if (! $isAnacrusisBar && ! $isSecondEndingStart) {
                    $barCount++;
                }

                if ($isFirstEndingStart) {
                    $secondEndingLength = $secondEndingSizes[$index] ?? 0;
                    $inFirstEnding = true;
                }

                if ($isRepeatBarline && $inFirstEnding) {
                    if (($secondEndingSizes[$index] ?? 0) >= 3) {
                        $flushCurrentLine();
                        $inFirstEnding = false;
                    }
                } elseif ($isStartRepeatBarline && $isAnacrusisBar) {
                    // Keep pickup bar and opening repeat together
                } elseif ($isRepeatBarline || $barCount === 4) {
                    $flushCurrentLine();
                    $inFirstEnding = false;
                }

                // After second ending ends, always break
                $bl = trim($bar['barline']);
                if ($inFirstEnding && in_array($bl, ['||', '|]', ':|:', ':|']) && ($isSecondEndingStart || ! $isFirstEndingStart)) {
                    $flushCurrentLine();
                    $inFirstEnding = false;
                }
            }
        }

        if (trim($currentLine) !== '') {
            $flushCurrentLine();
            if (trim($currentLine) !== '') {
                $lines[] = trim($currentLine);
            }
        }

        return implode("\n", $lines);
    }

    /**
     * Count beats (in eighth notes) in a bar of ABC notation.
     */
    private function countBeats(string $content, string $defaultNoteLength = '1/8'): float
    {
        // How many eighth notes is one L: unit worth?
        $multiplier = 1;
        if (preg_match('/(\d+)\/(\d+)/', $defaultNoteLength, $m)) {
            $multiplier = ((int) $m[1] / (int) $m[2]) / (1 / 8);
        }

        $content = preg_replace('/\(\d+/', '', $content);          // strip tuplet markers
        $content = preg_replace('/\{[^}]*\}/', '', $content);      // grace notes
        $content = preg_replace('/\[[^\]]*\]/', '', $content);     // chords
        $content = preg_replace('/[!+~HLMOPSTuv]/', '', $content); // decorations

        preg_match_all('/[a-gA-GzZ][,\']*(\d*)(\/?(\d*))/', $content, $matches, PREG_SET_ORDER);
        $beats = 0;
        foreach ($matches as $note) {
            $num = $note[1] !== '' ? (int) $note[1] : 1;
            $slash = $note[2];
            if ($slash === '/') {
                $denom = 2;
            } elseif (preg_match('/\/(\d+)/', $slash, $dm)) {
                $denom = (int) $dm[1];
            } else {
                $denom = 1;
            }
            $beats += ($num / $denom) * $multiplier;
        }

        return $beats;
    }
}
