import Foundation
import CoreText
import CoreGraphics
let fontName = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "Bodoni72-Bold"
let ch = CommandLine.arguments.count > 2 ? CommandLine.arguments[2] : "P"
let font = CTFontCreateWithName(fontName as CFString, 1000, nil)
var u = [UniChar](ch.utf16); var g = [CGGlyph](repeating: 0, count: 1)
CTFontGetGlyphsForCharacters(font, &u, &g, 1)
guard let path = CTFontCreatePathForGlyph(font, g[0], nil) else { print("[]"); exit(1) }
var out: [[Any]] = []
path.applyWithBlock { el in
  let e = el.pointee
  switch e.type {
  case .moveToPoint: out.append(["M", e.points[0].x, e.points[0].y])
  case .addLineToPoint: out.append(["L", e.points[0].x, e.points[0].y])
  case .addQuadCurveToPoint: out.append(["Q", e.points[0].x, e.points[0].y, e.points[1].x, e.points[1].y])
  case .addCurveToPoint: out.append(["C", e.points[0].x, e.points[0].y, e.points[1].x, e.points[1].y, e.points[2].x, e.points[2].y])
  case .closeSubpath: out.append(["Z"])
  @unknown default: break
  }
}
let data = try! JSONSerialization.data(withJSONObject: out)
print(String(data: data, encoding: .utf8)!)
print(CTFontCopyPostScriptName(font) as String, to: &standardError)
var standardError = FileHandle.standardError
extension FileHandle: TextOutputStream { public func write(_ s: String) { write(s.data(using: .utf8)!) } }
