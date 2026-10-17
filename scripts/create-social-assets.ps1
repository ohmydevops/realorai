Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path $PSScriptRoot -Parent
$outputRoot = Join-Path $projectRoot 'public/social'
New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null
$fontCollection = [System.Drawing.Text.PrivateFontCollection]::new()
$fontCollection.AddFontFile((Join-Path $projectRoot 'node_modules/vazir-font/dist/Vazir-Regular.ttf'))
$fontCollection.AddFontFile((Join-Path $projectRoot 'node_modules/vazir-font/dist/Vazir-Bold.ttf'))
$family = $fontCollection.Families[0]
$cream = [System.Drawing.ColorTranslator]::FromHtml('#eeeddf')
$dark = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#2e332c'))
$muted = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#777d6c'))
$green = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#557467'))
$surface = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#f8f6eb'))
$line = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#d8d7c5'), 2)
$titleFont = [System.Drawing.Font]::new($family, 54, [System.Drawing.FontStyle]::Bold)
$bodyFont = [System.Drawing.Font]::new($family, 20)
$smallFont = [System.Drawing.Font]::new($family, 14)
$questionFont = [System.Drawing.Font]::new($family, 70, [System.Drawing.FontStyle]::Bold)
foreach ($language in @('en', 'fa')) {
  $bitmap = [System.Drawing.Bitmap]::new(1200, 630)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.Clear($cream)
  $format = [System.Drawing.StringFormat]::new()
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $isPersian = $language -eq 'fa'
  if ($isPersian) { $format.FormatFlags = [System.Drawing.StringFormatFlags]::DirectionRightToLeft }
  $textX = if ($isPersian) { 500 } else { 64 }
  $artX = if ($isPersian) { 70 } else { 780 }
  $eyebrow = if ($isPersian) { 'یه بازی برای چشم‌های تیزبین' } else { 'A GAME FOR SHARP EYES' }
  $title = if ($isPersian) { "واقعیه یا`nهوش مصنوعیه؟" } else { "Real`nor AI?" }
  $description = if ($isPersian) { "پنج تا عکس. پنج تا حدس.`nمی‌تونی فرقشون رو تشخیص بدی؟" } else { "Five images. Five guesses.`nCan you tell the difference?" }
  $g.DrawString($eyebrow, $smallFont, $green, [System.Drawing.RectangleF]::new($textX, 46, 635, 52), $format)
  $g.DrawString($title, $titleFont, $dark, [System.Drawing.RectangleF]::new($textX, 111, 635, 255), $format)
  $g.DrawString($description, $bodyFont, $muted, [System.Drawing.RectangleF]::new($textX, 377, 635, 112), $format)
  $g.DrawString('ohmydevops.github.io/realorai', $smallFont, $green, 64, 558)
  # An abstract guessing card avoids exposing answers from the game catalog.
  $g.FillRectangle($green, $artX, 120, 345, 350)
  $g.FillRectangle($surface, ($artX + 30), 95, 285, 350)
  $g.DrawRectangle($line, ($artX + 30), 95, 285, 350)
  $g.DrawEllipse($line, ($artX + 71), 154, 200, 200)
  $centered = [System.Drawing.StringFormat]::new()
  $centered.Alignment = [System.Drawing.StringAlignment]::Center
  $centered.LineAlignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString('?', $questionFont, $green, [System.Drawing.RectangleF]::new(($artX + 71), 145, 200, 200), $centered)
  $cardLabel = if ($isPersian) { 'واقعی یا مصنوعی؟' } else { 'REAL / AI' }
  $g.DrawString($cardLabel, $smallFont, $dark, [System.Drawing.RectangleF]::new(($artX + 30), 365, 285, 55), $centered)
  for ($i = 0; $i -lt 5; $i++) { $g.FillEllipse($green, ($artX + 101 + 32 * $i), 508, 12, 12) }
  $bitmap.Save((Join-Path $outputRoot "og-$language.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $format.Dispose(); $centered.Dispose(); $g.Dispose(); $bitmap.Dispose()
}
foreach ($size in @(32, 180, 192, 512)) {
  $bitmap = [System.Drawing.Bitmap]::new($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear($green.Color)
  $iconFont = [System.Drawing.Font]::new($family, ($size * 0.48), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $centered = [System.Drawing.StringFormat]::new()
  $centered.Alignment = [System.Drawing.StringAlignment]::Center
  $centered.LineAlignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString('?', $iconFont, $surface, [System.Drawing.RectangleF]::new(0, 0, $size, $size), $centered)
  $name = if ($size -eq 180) { 'apple-touch-icon.png' } elseif ($size -eq 32) { 'favicon-32.png' } else { "icon-$size.png" }
  $bitmap.Save((Join-Path $projectRoot "public/$name"), [System.Drawing.Imaging.ImageFormat]::Png)
  $centered.Dispose(); $iconFont.Dispose(); $g.Dispose(); $bitmap.Dispose()
}
$titleFont.Dispose(); $bodyFont.Dispose(); $smallFont.Dispose(); $questionFont.Dispose()
$fontCollection.Dispose(); $dark.Dispose(); $muted.Dispose(); $green.Dispose(); $surface.Dispose(); $line.Dispose()
