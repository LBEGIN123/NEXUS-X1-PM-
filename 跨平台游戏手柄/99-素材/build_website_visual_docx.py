from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Cm, Inches, Pt, RGBColor

import build_website_spec_docx as base


PROJECT_ROOT = Path(__file__).resolve().parents[1]
FRAME_DIR = PROJECT_ROOT / "99-素材" / "产品帧序列"
BUILD_DIR = PROJECT_ROOT / "99-素材" / "_website_visual_spec_build"
OUT_DIR = PROJECT_ROOT / "07-官网方案"
DOCX_PATH = OUT_DIR / "Nexus 官网视觉方案.docx"

COVER_PATH = BUILD_DIR / "visual-cover.png"
REFERENCE_PATH = BUILD_DIR / "reference-weights.png"
HOME_FLOW_PATH = BUILD_DIR / "home-visual-flow.png"
DETAIL_FLOW_PATH = BUILD_DIR / "detail-visual-flow.png"
POINTER_PATH = BUILD_DIR / "pointer-depth.png"
PALETTE_PATH = BUILD_DIR / "palette-system.png"

FONT_REGULAR = r"C:\Windows\Fonts\msyh.ttc"
FONT_BOLD = r"C:\Windows\Fonts\msyhbd.ttc"

BLACK = "#000000"
WHITE = "#FFFFFF"
INK = "#090B12"
DEEP_BLUE = "#0C1A33"
BLUE = "#1D74FF"
PURPLE = "#7A3CFF"
ORANGE = "#E55B2A"
GOLD = "#D4AF37"
TEXT = "#F4F7FB"
MUTED = "#AAB3C0"
PALE = "#F4F7FB"
PALE_BLUE = "#EAF2FD"
PALE_GOLD = "#F7F0D8"
BORDER = "#D9D9D9"


def font(size: int, bold: bool = False):
    return base.font(size, bold)


def draw_text(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    fnt,
    fill: str,
    anchor: str | None = None,
) -> None:
    draw.text(xy, text, font=fnt, fill=fill, anchor=anchor)


def draw_wrapped(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    text: str,
    fnt,
    fill: str,
    *,
    center: bool = False,
    gap: int = 12,
) -> None:
    x1, y1, x2, y2 = box
    lines = base.wrap_text(draw, text, fnt, max(40, x2 - x1))
    line_heights = [base.text_size(draw, line, fnt)[1] for line in lines]
    total = sum(line_heights) + max(0, len(lines) - 1) * gap
    y = y1 + max(0, (y2 - y1 - total) / 2)
    for line, height in zip(lines, line_heights):
        if center:
            draw.text((x1 + (x2 - x1) / 2, y), line, font=fnt, fill=fill, anchor="ma")
        else:
            draw.text((x1, y), line, font=fnt, fill=fill)
        y += height + gap


def gradient_background(width: int, height: int, top: str, bottom: str) -> Image.Image:
    image = Image.new("RGB", (width, height), top)
    draw = ImageDraw.Draw(image)
    top_rgb = tuple(int(top.lstrip("#")[i : i + 2], 16) for i in (0, 2, 4))
    bottom_rgb = tuple(int(bottom.lstrip("#")[i : i + 2], 16) for i in (0, 2, 4))
    for y in range(height):
        t = y / max(1, height - 1)
        color = tuple(int(top_rgb[i] * (1 - t) + bottom_rgb[i] * t) for i in range(3))
        draw.line((0, y, width, y), fill=color)
    return image


def paste_fit(
    canvas: Image.Image,
    path: Path,
    box: tuple[int, int, int, int],
    *,
    radius: int = 0,
    blur: float = 0,
    brightness: float = 1,
) -> None:
    x1, y1, x2, y2 = box
    image = Image.open(path).convert("RGB")
    image = ImageOps.fit(image, (x2 - x1, y2 - y1), method=Image.Resampling.LANCZOS)
    if brightness != 1:
        image = ImageEnhanceBrightness.adjust(image, brightness)
    if blur:
        image = image.filter(ImageFilter.GaussianBlur(blur))
    if radius:
        mask = Image.new("L", image.size, 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle((0, 0, image.width, image.height), radius=radius, fill=255)
        canvas.paste(image, (x1, y1), mask)
    else:
        canvas.paste(image, (x1, y1))


class ImageEnhanceBrightness:
    @staticmethod
    def adjust(image: Image.Image, factor: float) -> Image.Image:
        from PIL import ImageEnhance

        return ImageEnhance.Brightness(image).enhance(factor)


def create_cover(path: Path) -> None:
    canvas = gradient_background(2200, 1160, "#05070C", "#0B1020")
    draw = ImageDraw.Draw(canvas)
    glow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((230, 120, 1050, 820), fill=(29, 116, 255, 62))
    glow_draw.ellipse((1120, 80, 1980, 880), fill=(122, 60, 255, 58))
    glow_draw.ellipse((350, 720, 1870, 1240), fill=(229, 91, 42, 35))
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), glow).convert("RGB")
    paste_fit(canvas, FRAME_DIR / "f_0340.webp", (150, 75, 2050, 1085), radius=42)
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((150, 78, 2050, 1085), radius=42, outline="#26314A", width=3)
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.rectangle((150, 838, 2050, 1085), fill=(5, 7, 12, 145))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(canvas)
    draw_text(draw, (220, 915), "NEXUS", font(54, True), WHITE)
    draw_text(draw, (220, 982), "CROSS-PLATFORM CONTROLLER", font(30), "#9FAEC6")
    draw_text(draw, (1975, 956), "视觉方案  /  V1.1", font(34, True), "#D4AF37", "ra")
    canvas.save(path, quality=96)


def create_reference_weights(path: Path) -> None:
    canvas = gradient_background(2400, 1360, "#070A11", "#0B1220")
    draw = ImageDraw.Draw(canvas)
    draw_text(draw, (120, 80), "参考设计语言权重", font(68, True), WHITE)
    draw_text(draw, (120, 176), "不是视觉拼贴，而是按职责分配影响比例。", font(34), MUTED)
    rows = [
        ("Podium", 25, "单页节奏、全屏媒体、克制大标题、黑场与亮场反差", BLUE),
        ("Otherlife", 25, "整场景鼠标跟随、空间层次、景深与阻尼", PURPLE),
        ("Insta360 Luna Ultra", 20, "固定锚点导航、左右产品构图、单页连续决策", "#2A9D8F"),
        ("Shopify Editions", 10, "长页章节索引、编辑式网格、信息节奏", "#93A4B8"),
        ("Royal Bev", 10, "产品揭示、编号选择、材质与印刷颗粒", ORANGE),
        ("Nexus 产品帧与品牌约束", 10, "产品外观权威、Apple 式克制、Insta360 式清晰", GOLD),
    ]
    y = 285
    for name, value, usage, color in rows:
        draw_text(draw, (120, y), name, font(38, True), TEXT)
        draw_text(draw, (120, y + 53), usage, font(27), MUTED)
        draw.rounded_rectangle((810, y + 10, 2020, y + 54), radius=22, fill="#182031")
        width = int(1210 * value / 25)
        draw.rounded_rectangle((810, y + 10, 810 + width, y + 54), radius=22, fill=color)
        draw_text(draw, (2110, y + 1), f"{value}%", font(44, True), color)
        y += 145
    draw.line((120, 1240, 2280, 1240), fill="#293246", width=2)
    draw_text(
        draw,
        (120, 1275),
        "边界：不复制参考页面的题材、品牌色、栏目结构与标志性文案。",
        font(30),
        MUTED,
    )
    canvas.save(path, quality=96)


def create_home_flow(path: Path) -> None:
    canvas = gradient_background(3600, 1380, "#080A10", "#0D1324")
    draw = ImageDraw.Draw(canvas)
    draw_text(draw, (100, 70), "单页前段视觉叙事", font(68, True), WHITE)
    draw_text(draw, (100, 165), "从首屏连续进入外观；顶部锚点导航始终存在。", font(33), MUTED)
    steps = [
        ("01", "首次进入", "正面静态定帧\n黑场淡入，鼠标跟随启用", "f_0240.webp", None),
        ("02", "外观滚动", "从正面进入细节\n轮廓光与材质最醒目", "f_0080.webp", None),
        ("03", "空间旋转", "有限角度变化\n蓝紫光先动，产品后动", "f_0270.webp", None),
        ("04", "产品定帧", "回到正面停顿\n标题与预约保持克制", "f_0320.webp", None),
        ("05", "章节交接", "正面定帧 + 查看一键切换\n平滑滚动到同页 #switch", "f_0416.webp", None),
    ]
    x = 100
    panel_w = 650
    gap = 50
    for index, (num, title, body, frame, _) in enumerate(steps):
        draw.rounded_rectangle((x, 250, x + panel_w, 1235), radius=34, fill="#111827", outline="#263149", width=3)
        draw_text(draw, (x + 38, 290), num, font(42, True), GOLD)
        draw_text(draw, (x + 38, 350), title, font(43, True), TEXT)
        paste_fit(canvas, FRAME_DIR / frame, (x + 35, 435, x + panel_w - 35, 790), radius=22, brightness=0.92)
        draw_wrapped(draw, (x + 42, 840, x + panel_w - 42, 1165), body, font(31), MUTED, center=True)
        if index < len(steps) - 1:
            base.arrow(draw, (x + panel_w + 9, 735), (x + panel_w + gap - 9, 735), color="#54627E")
        x += panel_w + gap
    canvas.save(path, quality=96)


def create_detail_flow(path: Path) -> None:
    canvas = gradient_background(3800, 1460, "#080A10", "#0D1324")
    draw = ImageDraw.Draw(canvas)
    draw_text(draw, (100, 68), "单页功能章节视觉叙事", font(68, True), WHITE)
    draw_text(draw, (100, 160), "延续同一页面的产品坐标，用朝向和留白组织章节。", font(33), MUTED)
    steps = [
        ("D01", "左 45°", "一键切换 + 配置软件\n文字位于右侧", "f_0270.webp", False),
        ("D02", "右 45°", "摇杆、按键、扳机、耐久\n文字位于左侧", "f_0270.webp", True),
        ("D03", "正面", "兼容平台与 SKU\n标准图文布局", "f_0240.webp", False),
        ("D04", "缩小模糊正面", "规格与 FAQ\n文字纯白，数值金色", "f_0340.webp", False),
        ("D05", "品牌收束", "799 元 + 京东 / 天猫\n金色只用于决策信息", "f_0416.webp", False),
    ]
    x = 95
    panel_w = 690
    gap = 50
    for index, (code, stance, body, frame, mirror) in enumerate(steps):
        draw.rounded_rectangle((x, 240, x + panel_w, 1315), radius=34, fill="#111827", outline="#263149", width=3)
        draw_text(draw, (x + 38, 280), code, font(40, True), GOLD)
        draw_text(draw, (x + 190, 280), stance, font(40, True), TEXT)
        image = Image.open(FRAME_DIR / frame).convert("RGB")
        if mirror:
            image = ImageOps.mirror(image)
        image = ImageOps.fit(image, (panel_w - 70, 350), method=Image.Resampling.LANCZOS)
        if code == "D04":
            image = image.filter(ImageFilter.GaussianBlur(2.3))
            image = ImageEnhanceBrightness.adjust(image, 0.48)
        mask = Image.new("L", image.size, 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle((0, 0, image.width, image.height), radius=22, fill=255)
        canvas.paste(image, (x + 35, 365), mask)
        draw_wrapped(draw, (x + 45, 760, x + panel_w - 45, 1185), body, font(31), MUTED, center=True)
        if index < len(steps) - 1:
            base.arrow(draw, (x + panel_w + 8, 700), (x + panel_w + gap - 8, 700), color="#54627E")
        x += panel_w + gap
    canvas.save(path, quality=96)


def create_pointer_depth(path: Path) -> None:
    canvas = gradient_background(2500, 1320, "#080B13", "#10182B")
    draw = ImageDraw.Draw(canvas)
    draw_text(draw, (100, 70), "整场景跟随，而不是单个元素漂浮", font(66, True), WHITE)
    draw_text(draw, (100, 165), "鼠标位移映射为相机视差，四层元素使用不同阻尼与位移。", font(32), MUTED)

    panel = (100, 260, 1530, 1190)
    draw.rounded_rectangle(panel, radius=36, fill="#0C111E", outline="#263149", width=3)
    for inset, color in ((110, "#17233B"), (210, "#1D3155"), (310, "#283B63")):
        draw.rounded_rectangle(
            (panel[0] + inset, panel[1] + inset, panel[2] - inset, panel[3] - inset),
            radius=36,
            outline=color,
            width=3,
        )
    paste_fit(canvas, FRAME_DIR / "f_0240.webp", (390, 500, 1240, 980), radius=26, brightness=0.85)
    draw.line((1260, 390, 1560, 260), fill=GOLD, width=4)
    draw.ellipse((1225, 350, 1320, 445), outline=GOLD, width=5)
    draw.ellipse((1245, 370, 1300, 425), fill=GOLD)
    draw_text(draw, (1320, 290), "鼠标 / 指针", font(31, True), GOLD)

    x = 1650
    draw_text(draw, (x, 285), "层级参数", font(50, True), TEXT)
    layers = [
        ("环境背景", "0.25", "2–4 px", "#46536A"),
        ("蓝紫轮廓光", "0.45", "18–32 px", BLUE),
        ("手柄主体", "0.30", "8–18 px  /  ±1.5°", PURPLE),
        ("金色粒子与高光", "0.60", "24–40 px", GOLD),
    ]
    y = 370
    for name, damping, move, color in layers:
        draw.rounded_rectangle((x, y, 2385, y + 160), radius=26, fill="#111827", outline="#263149", width=2)
        draw.rounded_rectangle((x + 30, y + 32, x + 48, y + 128), radius=9, fill=color)
        draw_text(draw, (x + 80, y + 30), name, font(34, True), TEXT)
        draw_text(draw, (x + 80, y + 88), f"阻尼 {damping}   位移 {move}", font(27), MUTED)
        y += 185
    draw_text(
        draw,
        (x, 1135),
        "离开页面：元素回正，不能让产品长期停在偏移姿态。",
        font(28),
        MUTED,
    )
    canvas.save(path, quality=96)


def create_palette_system(path: Path) -> None:
    canvas = gradient_background(2400, 1240, "#080A10", "#0D1324")
    draw = ImageDraw.Draw(canvas)
    draw_text(draw, (100, 70), "色彩、材质与光线", font(66, True), WHITE)
    draw_text(draw, (100, 164), "中性色承载产品，蓝紫定义空间，金橙只负责反馈与温度。", font(32), MUTED)
    swatches = [
        ("INK", "#090B12", "页面背景", 46),
        ("DEEP", "#0C1A33", "空间层次", 16),
        ("BLUE", "#1D74FF", "轮廓光", 10),
        ("PURPLE", "#7A3CFF", "轮廓光", 10),
        ("ORANGE", "#E55B2A", "环境光", 5),
        ("GOLD", "#D4AF37", "数值与反馈", 6),
        ("LIGHT", "#F4F7FB", "主文字", 4),
        ("MUTED", "#AAB3C0", "次文字", 3),
    ]
    x = 100
    for label, color, use, ratio in swatches:
        draw.rounded_rectangle((x, 265, x + 260, 655), radius=28, fill=color, outline="#34415A", width=2)
        draw_text(draw, (x + 22, 585), label, font(26, True), WHITE if color not in {"#F4F7FB", "#AAB3C0"} else BLACK)
        draw_text(draw, (x + 22, 690), color, font(31, True), TEXT)
        draw_text(draw, (x + 22, 738), use, font(25), MUTED)
        draw_text(draw, (x + 22, 790), f"{ratio}% 视觉面积", font(24, True), GOLD if ratio >= 5 else MUTED)
        x += 280
    draw.line((100, 900, 2300, 900), fill="#293246", width=2)
    draw_text(draw, (100, 945), "光线原则", font(41, True), GOLD)
    draw_text(
        draw,
        (100, 1010),
        "蓝紫轮廓光是最稳定的空间标记；橙红环境光只从背景边缘进入；金色只落在摇杆环、关键数值和可点击状态上。",
        font(31),
        TEXT,
    )
    draw_text(
        draw,
        (100, 1080),
        "禁止：大面积高饱和渐变、霓虹紫黑同色堆叠、廉价红黄促销色、与产品白色壳体不一致的冷灰。",
        font(29),
        MUTED,
    )
    canvas.save(path, quality=96)


def set_run_font(run, size: float = 10.5, bold: bool = False, color: str = BLACK) -> None:
    base.set_run_font(run, size=size, bold=bold, color=color)


def add_title(doc: Document, text: str) -> None:
    title = doc.add_paragraph(style="Title")
    title.add_run(text)
    base.style_paragraph(title, 0, 5, 1.0, True)


def add_body(doc: Document, text: str, *, keep_next: bool = False) -> None:
    base.add_body(doc, text, keep_next=keep_next)


def add_heading(doc: Document, text: str, level: int = 1, *, page_break_before: bool = False) -> None:
    base.add_heading(doc, text, level=level, page_break_before=page_break_before)


def add_caption(doc: Document, text: str) -> None:
    base.add_caption(doc, text)


def add_image(doc: Document, path: Path, width: float, alt_text: str) -> None:
    base.add_image(doc, path, width, alt_text)


def add_table(
    doc: Document,
    headers: list[str],
    rows: list[list[str]],
    widths: list[float],
    *,
    centers: set[int] | None = None,
    first_center: bool = False,
    font_size: float = 9.0,
    header_size: float = 9.0,
    body_sizes: list[float] | None = None,
) -> None:
    base.add_table(
        doc,
        headers,
        rows,
        widths,
        centers=centers,
        first_center=first_center,
        font_size=font_size,
        header_size=header_size,
        body_sizes=body_sizes,
    )


def add_footer(section) -> None:
    p = section.footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    base.style_paragraph(p, 0, 0, 1.0)
    run = p.add_run("Nexus 官网视觉方案  |  v1.1  |  第 ")
    set_run_font(run, size=8.5, color="#7A8495")
    begin = base.OxmlElement("w:fldChar")
    begin.set(base.qn("w:fldCharType"), "begin")
    instr = base.OxmlElement("w:instrText")
    instr.set(base.qn("xml:space"), "preserve")
    instr.text = " PAGE "
    end = base.OxmlElement("w:fldChar")
    end.set(base.qn("w:fldCharType"), "end")
    run._r.append(begin)
    run._r.append(instr)
    run._r.append(end)
    run2 = p.add_run(" 页")
    set_run_font(run2, size=8.5, color="#7A8495")


def configure_document(doc: Document) -> None:
    section = doc.sections[0]
    section.page_width = Cm(21)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(1.55)
    section.bottom_margin = Cm(1.45)
    section.left_margin = Cm(1.72)
    section.right_margin = Cm(1.72)
    section.header_distance = Cm(0.7)
    section.footer_distance = Cm(0.65)
    add_footer(section)

    normal = doc.styles["Normal"]
    normal.font.name = "Microsoft YaHei"
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = RGBColor.from_string(BLACK.replace("#", ""))
    normal._element.rPr.rFonts.set(base.qn("w:eastAsia"), "Microsoft YaHei")
    normal.paragraph_format.space_after = Pt(5)
    normal.paragraph_format.line_spacing = 1.22

    for name, size in (("Title", 22), ("Heading 1", 16), ("Heading 2", 12.5)):
        style = doc.styles[name]
        style.font.name = "Microsoft YaHei"
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.color.rgb = RGBColor.from_string(BLACK.replace("#", ""))
        style._element.rPr.rFonts.set(base.qn("w:eastAsia"), "Microsoft YaHei")
        p_pr = style._element.get_or_add_pPr()
        for border in p_pr.findall(base.qn("w:pBdr")):
            p_pr.remove(border)


def add_metadata_table(doc: Document) -> None:
    add_table(
        doc,
        ["项目", "内容"],
        [
            ["文档名称", "Nexus 跨平台游戏手柄官网视觉方案"],
            ["版本与日期", "v1.1  |  2026-09-24"],
            ["读者", "产品负责人、设计总监、视觉设计、前端研发、内容运营"],
            ["设计范围", "单页长滚动官网、首屏、外观滚动、功能章节、关键组件与动效"],
            ["参考输入", "Podium、Otherlife、Insta360 Luna Ultra、Shopify Editions、Royal Bev"],
            ["产品素材", "现有 416 张 WebP 帧，f_0001 至 f_0416，1600 × 900"],
            ["项目性质", "虚构概念模拟，不连接真实支付、订单、留资或电商系统"],
            ["决策边界", "视觉方向遵循单页长滚动结构；不建立独立详情页"],
        ],
        [1.28, 5.39],
        first_center=True,
        body_sizes=[8.9, 8.9],
    )


def build_document() -> None:
    BUILD_DIR.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    create_cover(COVER_PATH)
    create_reference_weights(REFERENCE_PATH)
    create_home_flow(HOME_FLOW_PATH)
    create_detail_flow(DETAIL_FLOW_PATH)
    create_pointer_depth(POINTER_PATH)
    create_palette_system(PALETTE_PATH)

    doc = Document()
    configure_document(doc)

    add_title(doc, "Nexus 跨平台游戏手柄官网视觉方案")
    subtitle = doc.add_paragraph()
    base.style_paragraph(subtitle, 0, 12, 1.0, True)
    run = subtitle.add_run("视觉方向 v1.1  |  NEXUS  |  2026-09-24")
    set_run_font(run, size=10, color="#667085")

    add_body(
        doc,
        "本方案把整个网站定义为一个持续存在的产品装置。用户在同一长页面内从外观进入功能、规格与购买，顶部锚点导航负责章节定位。参考页面只贡献设计语言：Podium 控制节奏与反差，Otherlife 提供整场景跟随，Insta360 Luna Ultra 提供单页结构与锚点导航，Shopify Editions 组织长页信息，Royal Bev 处理产品揭示与材质。Nexus 的最终外观、色彩和光线仍以现有产品帧为准。",
        keep_next=True,
    )
    add_caption(doc, "产品视觉基准")
    add_image(doc, COVER_PATH, 6.45, "Nexus 跨平台游戏手柄视觉基准图，正面暗色电影感产品图")

    add_heading(doc, "文档信息", page_break_before=True)
    add_metadata_table(doc)

    add_heading(doc, "变更记录")
    add_table(
        doc,
        ["版本", "日期", "变更内容", "状态"],
        [
            ["v1.1", "2026-09-24", "将首页与产品详情合并为单页长滚动；加入 Insta360 Luna Ultra 的结构参考、固定锚点导航和连续章节分镜", "已确认"],
            ["v1", "2026-09-23", "初版：确定参考权重、视觉母题、色彩材质、字体、页面分镜、鼠标跟随、响应式和验收标准", "历史版本"],
        ],
        [0.65, 1.08, 4.08, 0.86],
        centers={0, 1, 3},
        body_sizes=[8.7, 8.7, 8.5, 8.5],
    )

    add_heading(doc, "1 设计结论")
    add_body(
        doc,
        "先定结论：Nexus 不做静态产品页，也不做信息密集的电子产品说明书。整站是一条连续长页面，视觉由一个持续存在的产品主体、克制的空间运动和高对比暗色电影感组成。用户滚动时看到外观，移动鼠标时感到产品与光线存在真实空间关系，继续向下后用产品朝向组织功能叙事。",
        keep_next=True,
    )
    add_table(
        doc,
        ["决策维度", "结论", "直接效果"],
        [
            ["首屏职责", "90% 画面给产品，文字只占安全边缘", "第一眼识别为高端硬件，而不是促销页"],
            ["页面结构", "单页长滚动 + 固定锚点导航，不建立详情页", "用户可以按顺序浏览，也可以直接跳到功能或规格"],
            ["前段叙事", "外观、材质、光线和有限旋转", "功能信息不打断审美判断"],
            ["标志性交互", "整场景跟随鼠标，分层视差，不做元素贴光标", "空间感来自产品、光线与背景共同运动"],
            ["同页功能章节", "左 45° 讲切换，右 45° 讲操控，正面讲兼容，模糊正面承接规格", "章节随产品朝向自然分段，不发生页面加载"],
            ["购买区", "日常价 799 元，京东与天猫并列", "把促销信息留到决策终点，不污染首屏"],
        ],
        [1.18, 3.25, 2.24],
        first_center=True,
        body_sizes=[8.8, 8.7, 8.6],
    )

    add_heading(doc, "2 视觉目标与原则")
    add_body(
        doc,
        "视觉目标不是“像游戏产品”，而是让 Nexus 同时具备高端消费电子品的可信度与游戏文化的动势。设计必须服从产品外观，所有效果都用来解释材质、光线与空间，而不是证明网页会动。",
        keep_next=True,
    )
    add_table(
        doc,
        ["原则", "执行定义", "禁止项"],
        [
            ["产品唯一主角", "产品占首屏视觉重心；文字、粒子和 UI 都不能遮住主体", "多卡片并排抢焦点；首屏展示参数矩阵"],
            ["电影级高对比", "黑场、亮部、轮廓光形成明确明暗关系；亮场只用于短暂停顿", "全局低对比灰雾；同亮度内容连续滚动"],
            ["克制的奢华", "金色仅点缀高价值细节；材质以清晰高光和细腻纹理取胜", "金色大面积铺底；金属渐变滥用"],
            ["空间一致", "鼠标、滚动和章节切换都围绕同一产品坐标系", "每个模块各自使用互不相关的动画"],
            ["留白即层级", "45° 视角的留白方向决定文字位置；正文不穿产品关键区域", "在 45° 章节做对称居中密集排版"],
        ],
        [1.15, 3.38, 2.14],
        first_center=True,
        body_sizes=[8.7, 8.6, 8.5],
    )

    add_heading(doc, "3 参考设计语言解构")
    add_caption(doc, "图 1 参考设计语言权重")
    add_image(doc, REFERENCE_PATH, 6.55, "参考设计语言权重图，Podium、Otherlife、Shopify Editions、Royal Bev 与 Nexus 品牌约束")
    add_body(
        doc,
        "权重不是对页面做视觉混合，而是确定哪些参考拥有决策权。Insta360 Luna Ultra 贡献单页结构和固定锚点导航；其黄色购买按钮、产品参数文案和页面内容不复刻。Apple、Rockstar 的克制与高对比继续作为 Nexus 品牌约束。",
        keep_next=True,
    )
    add_table(
        doc,
        ["参考", "权重", "学习内容", "明确不复刻"],
        [
            ["Podium", "25%", "全屏产品时刻、黑场与亮场转换、大标题停顿、素材占据主导", "体育题材、全大写排版、作品集网格"],
            ["Otherlife", "25%", "整场景鼠标跟随、深度分层、阻尼回正、滚动改变场景内容", "绿色 CTA、手机题材、圆形菜单和倾斜卡片"],
            ["Insta360 Luna Ultra", "20%", "单页连续结构、固定锚点导航、产品左右构图、快速决策路径", "黄色购买按钮、Leica 文案、具体机型栏目和素材"],
            ["Shopify Editions", "10%", "长页章节索引、6/12 栅格、图文数据交替、编辑式节奏", "美术史视觉、洋红品牌系统、超长章节数量"],
            ["Royal Bev", "10%", "产品标题化、编号选择、材质纹理、进入视口时的揭示", "红蓝奶油色系统、饮料图像、手写标签和波浪分隔"],
            ["Nexus 视觉约束", "10%", "高对比暗场、Apple 式克制、产品帧权威和蓝紫光线", "任何会改变产品外观、比例或配色的做法"],
        ],
        [1.20, 0.62, 3.18, 1.67],
        centers={1},
        body_sizes=[8.5, 8.4, 8.3, 8.3],
    )

    add_heading(doc, "4 整体视觉母题")
    add_table(
        doc,
        ["维度", "统一语言", "落地表现"],
        [
            ["视觉气质", "暗色电影感、精密、克制、带速度暗示", "黑场淡入；硬件像悬浮在真实光线中；动效有重量和阻尼"],
            ["构图", "中心产品 + 非对称文字 + 大尺度留白", "桌面文案靠左或靠右；手机文字落在底部安全区域"],
            ["材质", "白色细纹壳体、黑蓝底壳、金属金环、玻璃质感高光", "材质特写保留微小纹理，不使用塑料感平涂"],
            ["光线", "蓝紫轮廓光、橙红环境底光、金色高光点", "光先于产品产生视差，背景保持低频、深色"],
            ["节奏", "长停顿 + 短爆发 + 标记式转场", "每段只解释一个卖点；不要让连续动画一直保持最高强度"],
            ["叙事顺序", "外观优先，功能随后，决策最后", "同一页面内建立欲望、理解与行动，不切页"],
        ],
        [1.05, 2.28, 3.34],
        first_center=True,
        body_sizes=[8.7, 8.6, 8.5],
    )

    add_heading(doc, "5 色彩、材质与光线系统")
    add_caption(doc, "图 2 色彩、材质与光线系统")
    add_image(doc, PALETTE_PATH, 6.55, "Nexus 官网色彩、材质和光线系统图")
    add_table(
        doc,
        ["角色", "色值", "建议面积", "使用规则"],
        [
            ["页面背景", "#090B12", "基础底色", "承担黑场与空间；不用纯黑铺满所有区域"],
            ["深蓝层次", "#0C1A33", "约 16%", "用于背景坡面、浮层与章节过渡"],
            ["蓝紫轮廓光", "#1D74FF / #7A3CFF", "约 20%", "定义产品边缘与连接状态；左右光不能同时等强"],
            ["橙红环境光", "#E55B2A", "不超过 5%", "只从背景边缘进入，增加温度，不覆盖产品主体"],
            ["金色强调", "#D4AF37", "约 6%", "仅用于摇杆环、价格、按钮、关键数值和成功反馈"],
            ["主文字", "#F4F7FB", "正文主色", "用于标题和关键句；规格区保持高对比"],
            ["次文字", "#AAB3C0", "辅助信息", "用于标签、说明和页脚；不能承载重要数值"],
        ],
        [1.08, 1.28, 0.90, 3.41],
        centers={2},
        body_sizes=[8.6, 8.4, 8.4, 8.3],
    )
    add_body(
        doc,
        "色彩比例按视觉面积控制，而不是给页面套固定主题色。产品白色壳体、深蓝底壳和金色摇杆环提供真实色源，网页背景只负责延伸这些材质。橙红不作为品牌主色，金色不承担按钮大面积填充。",
    )

    add_heading(doc, "6 字体与排版")
    add_table(
        doc,
        ["层级", "字体建议", "桌面尺寸", "手机尺寸", "使用规则"],
        [
            ["Hero 主标题", "Source Han Sans SC Heavy / 思源黑体", "72–96 px", "44–56 px", "只出现一次；字距 0，不使用负字距"],
            ["章节标题", "Source Han Sans SC Bold", "56–72 px", "34–42 px", "每屏最多一个；左侧或右侧对齐产品留白"],
            ["小节标题", "Source Han Sans SC Bold", "28–36 px", "24–28 px", "与正文形成清楚层级；不全部大写"],
            ["正文", "Source Han Sans SC Regular", "16–18 px", "15–16 px", "每段最多两到三行；45° 章节最多两段"],
            ["英文标签", "Inter Medium", "11–13 px", "10–12 px", "正字距约 0.12em；只做章节标签和状态"],
            ["关键数值", "Inter Tight Semibold", "20–32 px", "18–24 px", "使用金色；规格和价格必须可快速扫读"],
        ],
        [1.06, 1.78, 1.07, 0.92, 1.84],
        centers={2, 3},
        body_sizes=[8.5, 8.2, 8.2, 8.2, 8.2],
    )
    add_table(
        doc,
        ["排版项目", "规则"],
        [
            ["语言层级", "中文承担主要信息；英文仅作为 DESIGN、SWITCH、CONTROL、COMPATIBILITY、SPECIFICATIONS 等标签"],
            ["标题语气", "短、动词导向、克制；不使用夸张口号和连续感叹"],
            ["行宽", "桌面正文最长 520–620 px；手机保留 20–24 px 左右边距"],
            ["行高", "标题 1.02–1.10；正文 1.55–1.70；英文标签 1.20"],
            ["对齐", "45° 章节顺产品朝向选择左或右对齐；规格矩阵用左对齐加中心数值"],
        ],
        [1.18, 5.49],
        first_center=True,
        body_sizes=[8.7, 8.7],
    )

    add_heading(doc, "6.1 栅格与间距", level=2)
    add_table(
        doc,
        ["项目", "桌面端", "手机端", "说明"],
        [
            ["页面栅格", "12 列，最大宽度 1600 px", "4 列，左右边距 20–24 px", "产品可跨越栅格，文字遵守栅格"],
            ["页边距", "48–72 px", "20–24 px", "避免内容贴边；给鼠标跟随保留空间"],
            ["基础间距", "8 px 基数", "8 px 基数", "常用级差 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128"],
            ["章节高度", "100–160 vh", "80–120 vh", "保证视觉停顿，不用连续十段文字填满"],
            ["组件圆角", "0–8 px", "0–8 px", "产品图和按钮保持硬件感，不使用大圆角卡片"],
        ],
        [1.05, 1.80, 1.53, 2.29],
        first_center=True,
        body_sizes=[8.5, 8.3, 8.3, 8.3],
    )

    add_heading(doc, "7 单页前段视觉分镜", page_break_before=True)
    add_caption(doc, "图 3 单页前段视觉叙事")
    add_image(doc, HOME_FLOW_PATH, 6.62, "单页前段五阶段视觉叙事图，从产品正面到同页功能章节")
    add_table(
        doc,
        ["阶段", "画面", "文字", "动效", "优先级"],
        [
            ["H0 首次进入", "产品正面居中，占首屏约 90%", "掌控，不设边界 / 跨平台游戏手柄 / 预约", "黑场淡入；鼠标跟随启用；按钮无持续呼吸", "P0"],
            ["H1 外观滚动", "产品从正面到细节，材质成为主要信息", "DESIGN 小标签", "滚动映射帧序列；蓝紫光与产品产生相对视差", "P0"],
            ["H2 空间旋转", "有限角度变化，不承诺任意 3D 旋转", "外观不叠加参数", "轮廓光移动幅度大于主体；产品去程慢、回正稳", "P0"],
            ["H3 产品定帧", "回到正面或轻微 45°，留出大块空白", "短标题 + 一行材质说明", "滚动停顿时运动自然衰减，不持续抖动", "P1"],
            ["H4 章节交接", "正面定帧，画面压暗", "查看一键切换", "点击后平滑滚动到同页 #switch；不刷新页面", "P0"],
        ],
        [0.92, 1.55, 1.56, 2.16, 0.58],
        centers={4},
        body_sizes=[8.3, 8.2, 8.0, 8.0, 8.1],
    )
    add_body(
        doc,
        "单页前段只有五个视觉节拍。顶部固定导航始终保留 NEXUS、设计、一键切换、操控、规格和预约；点击章节名称只进行同页平滑滚动。任何新增卖点都必须替换现有节拍，而不是延长前段。",
    )

    add_heading(doc, "7.1 首屏构图")
    add_table(
        doc,
        ["区域", "桌面端", "手机端", "安全规则"],
        [
            ["产品", "居中，占视口宽 70–82%，高 68–82%", "占视口宽 92–108%，允许局部出画", "面部按键、摇杆和金色环不得被文字遮挡"],
            ["标题", "左侧 48–72 px 安全区，垂直居中偏下", "底部安全区，产品下沿之上", "标题最多两行；副标题紧随其下"],
            ["导航", "左侧 NEXUS，中部锚点菜单，右侧预约", "Logo + 菜单图标 + 预约", "背景透明；离开首屏后保留细下边线，不显示厚实导航条"],
            ["预约", "白字透明底 + 金色描边或细底边", "宽度不超过 132 px", "不显示价格、倒计时、优惠标签"],
            ["鼠标跟随", "整个产品场景响应", "关闭指针跟随", "手机使用触摸拖动或自动微动"],
        ],
        [1.00, 2.35, 1.60, 1.67],
        first_center=True,
        body_sizes=[8.5, 8.3, 8.3, 8.2],
    )

    add_heading(doc, "8 鼠标跟随与空间交互")
    add_caption(doc, "图 4 鼠标跟随的空间层级")
    add_image(doc, POINTER_PATH, 6.55, "鼠标跟随空间层级图，环境、轮廓光、产品和高光使用不同位移与阻尼")
    add_body(
        doc,
        "鼠标移动只控制一个统一的空间视点，所有层跟随同一方向并逐步衰减。产品移动范围要小，光线和微粒可稍大；光标离开后，整个场景回正。这个交互是单页的核心签名，但不能妨碍阅读、锚点导航、预约或滚动。",
        keep_next=True,
    )
    add_table(
        doc,
        ["层级", "参考位移", "旋转", "阻尼", "视觉作用"],
        [
            ["环境背景", "2–4 px", "0°", "0.25", "建立空间底座；几乎察觉不到单独移动"],
            ["蓝紫轮廓光", "18–32 px", "0.2–0.6°", "0.45", "承担主要空间感，让产品像处于真实光线中"],
            ["手柄主体", "8–18 px", "±1.0–1.5°", "0.30", "保持硬件稳定；不做大幅追随光标"],
            ["金色粒子与高光", "24–40 px", "0.3–0.8°", "0.60", "补充深度和奢华感，不能遮挡按键与摇杆"],
        ],
        [1.20, 1.10, 1.10, 0.80, 2.47],
        centers={1, 2, 3},
        body_sizes=[8.7, 8.4, 8.4, 8.3, 8.4],
    )
    add_table(
        doc,
        ["场景", "行为", "优先级", "降级规则"],
        [
            ["桌面鼠标进入", "启用自定义指针；显示“旋转查看”或细环状态", "P0", "系统减少动态效果时只保留指针状态，不移动产品"],
            ["连续移动", "位置使用弹性阻尼，不做逐帧硬跟随", "P0", "低性能设备将更新频率降至 30 fps，位移范围不变"],
            ["鼠标离开", "300–500 ms 回正，不能停在偏移姿态", "P0", "触摸设备直接回到中性视角"],
            ["滚动与鼠标同时发生", "滚动拥有更高控制权；跟随只做小幅视差", "P0", "滚动高峰期暂停粒子更新，保证帧序列稳定"],
            ["手机与平板", "关闭鼠标跟随，保留拖动或自动微动", "P1", "无拖动交互时使用静态定帧，不伪造鼠标效果"],
        ],
        [1.15, 3.06, 0.62, 1.84],
        centers={2},
        body_sizes=[8.5, 8.4, 8.2, 8.3],
    )

    add_heading(doc, "9 同页功能章节视觉分镜")
    add_caption(doc, "图 5 同页功能章节视觉叙事")
    add_image(doc, DETAIL_FLOW_PATH, 6.62, "单页功能章节视觉叙事图，左四十五度、右四十五度、正面、规格和购买")
    add_table(
        doc,
        ["章节", "产品朝向", "文字位置", "视觉重点", "优先级"],
        [
            ["D01 一键切换与配置软件", "左 45°", "产品右侧", "平台标签依次点亮；切换按钮使用金色成功反馈", "P0"],
            ["D02 操控与耐久", "右 45°", "产品左侧", "摇杆、按键、扳机做定点特写；高光沿轮廓移动", "P1"],
            ["D03 兼容与 SKU", "正面", "标准图文栅格", "平台名称以文字标签呈现；没有图标时不用伪 Logo", "P1"],
            ["D04 完整规格与 FAQ", "正面缩小、偏右、轻度模糊、压暗", "左侧或中部文字层", "纯白正文 + 金色数值；背景保持低对比", "P2"],
            ["D05 购买区", "品牌收束画面", "居中或下半区", "日常价 799 元；京东、天猫并列；无促销彩带", "P0"],
        ],
        [1.42, 1.42, 1.20, 2.18, 0.56],
        centers={4},
        body_sizes=[8.3, 8.2, 8.2, 8.1, 8.0],
    )
    add_body(
        doc,
        "功能章节沿用同一个产品坐标系，不建立新页面。每次进入章节时，产品先完成朝向变化，文字再以 120–200 ms 延迟进入；反向滚动时顺序相反。固定导航只更新当前章节状态，不产生整页重载。",
    )

    add_heading(doc, "9.1 45° 章节文字密度")
    add_table(
        doc,
        ["元素", "上限", "规则"],
        [
            ["章节标题", "1 个", "说明本章功能，不使用抽象口号"],
            ["正文说明", "2 句", "每句只表达一个含义；避免参数堆叠"],
            ["卖点", "3 个", "短标签 + 一行解释；金色只用于状态或关键数值"],
            ["操作演示", "1 个", "一个章节只保留一个主动画；配置软件作为一键切换的子内容"],
            ["返回顶部", "1 个", "固定在页面边缘，不覆盖产品关键区域"],
        ],
        [1.16, 0.74, 4.77],
        centers={1},
        body_sizes=[8.7, 8.5, 8.6],
    )

    add_heading(doc, "10 组件与界面语言")
    add_table(
        doc,
        ["组件", "默认状态", "悬停 / 激活", "视觉规则"],
        [
            ["顶部导航", "透明背景，NEXUS、锚点菜单和预约并列", "离开首屏后显示细下边线；当前章节高亮", "固定顶部；不跳转新页面；高度 56–64 px"],
            ["预约按钮", "透明底，白字，金色细描边", "金色底光或轻微填充，不改变尺寸", "不使用倒计时、券标签和红色强调"],
            ["平台标签", "深色胶囊，MUTED 文字", "切换成功后金色文字与蓝紫光边", "没有图标时只用文字，不使用近似平台 Logo"],
            ["规格矩阵", "白色标签，金色数值，细灰分隔线", "不影响交互", "每行只表达一个规格；数值右对齐"],
            ["购买按钮", "白字黑底；主按钮保留金色细边", "悬停增加 4–8% 亮度，按压下沉 1–2 px", "京东与天猫同级；不使用平台品牌色铺满"],
            ["FAQ 展开", "问题白字，加号或线形图标", "展开区域使用深蓝底与细边线", "高度动画 240–360 ms；不弹窗"],
            ["光标", "14–18 px 细环或 6 px 点", "产品区域显示“旋转查看”；按钮区域恢复标准指针", "触摸设备完全隐藏自定义光标"],
            ["滚动进度", "1 px 蓝紫渐变线", "当前章节点亮", "只出现在单页边缘，不干扰正文"],
        ],
        [1.08, 1.62, 1.75, 2.22],
        first_center=True,
        body_sizes=[8.4, 8.2, 8.2, 8.2],
    )

    add_heading(doc, "11 响应式与性能")
    add_table(
        doc,
        ["项目", "桌面端", "手机端", "视觉验收"],
        [
            ["首屏 Hero", "产品 90% 画面，标题位于左侧安全区", "产品作为全屏背景，标题位于底部安全区", "按键和摇杆不被文字遮挡"],
            ["鼠标跟随", "完整四层视差", "关闭指针跟随；使用拖动或自动微动", "设备旋转或拖动后可以回到中性视角"],
            ["同页 45° 章节", "产品一侧，文字在另一侧留白", "产品保持全屏，文字覆盖在留白侧并避开主体", "不改成上下堆叠卡片"],
            ["锚点导航", "顶部完整菜单，当前章节高亮", "菜单面板；点击后平滑定位", "URL hash 只定位章节，不打开独立页面"],
            ["帧序列", "使用完整 416 帧", "约 200 帧，按设备降级", "前后滚动不跳帧、不闪烁"],
            ["规格背景", "产品偏右、轻度模糊、压暗", "产品缩小，文字位于底部安全区", "正文对比度不会因背景波动而下降"],
            ["低动态模式", "保留定帧、淡入和静态层次", "关闭视差、粒子和连续帧动画", "所有内容仍可完整阅读"],
        ],
        [1.02, 2.18, 2.15, 1.32],
        first_center=True,
        body_sizes=[8.5, 8.3, 8.3, 8.2],
    )
    add_table(
        doc,
        ["性能目标", "设计要求"],
        [
            ["首屏加载", "先显示正面定帧与标题，再预加载后续关键帧；不使用空白等待画面"],
            ["动效帧率", "桌面目标 60 fps，最低 45 fps；移动端目标 30 fps，交互不能阻塞滚动"],
            ["帧管理", "按滚动方向预取，卸载不可见帧；避免同一时刻解码过多高清 WebP"],
            ["鼠标跟随", "跟随逻辑与滚动帧解耦；滚动高峰期降低粒子更新频率"],
            ["降级顺序", "先减少粒子，再降低帧采样，最后关闭视差；不改变产品位置和文字层级"],
        ],
        [1.28, 5.39],
        first_center=True,
        body_sizes=[8.7, 8.7],
    )

    add_heading(doc, "12 动效与转场规则")
    add_table(
        doc,
        ["编号", "动效", "时长 / 参数", "触发", "优先级"],
        [
            ["M01", "首屏淡入", "600–900 ms", "页面首次加载完成", "P0"],
            ["M02", "整场景鼠标跟随", "阻尼 0.25–0.60；回正 300–500 ms", "桌面指针移动和离开", "P0"],
            ["M03", "外观滚动", "由滚动位置直接映射", "单页前段滚动", "P0"],
            ["M04", "轮廓光移动", "产品主体的 1.5–2 倍位移", "鼠标移动、章节切换", "P0"],
            ["M05", "功能章节切换", "产品 600–800 ms；文字延迟 120–200 ms", "滚动进入同页章节", "P0"],
            ["M06", "平台状态点亮", "每项 120–180 ms，总计不超过 900 ms", "一键切换演示", "P0"],
            ["M07", "按钮反馈", "160–220 ms", "悬停与按压", "P0"],
            ["M08", "FAQ 展开", "240–360 ms", "点击问题", "P1"],
            ["M09", "规格背景视差", "环境 2–4 px", "单页规格章节滚动", "P2"],
        ],
        [0.62, 1.55, 2.35, 1.64, 0.52],
        centers={0, 4},
        body_sizes=[8.3, 8.3, 8.2, 8.2, 8.0],
    )

    add_heading(doc, "13 视觉验收标准")
    add_table(
        doc,
        ["编号", "验收项", "通过标准", "责任"],
        [
            ["V01", "首屏产品权重", "产品占据约 90% 视觉面积；标题、副标题和预约不遮挡按键与摇杆", "设计"],
            ["V02", "参考边界", "能识别 Insta360 的单页结构与锚点导航、Podium 的节奏、Otherlife 的空间跟随，但没有复制参考页面题材或品牌色", "设计总监"],
            ["V03", "鼠标跟随", "环境、光线、主体和粒子位移不同；产品位移 8–18 px、旋转不超过 ±1.5°，离开后回正", "设计、研发"],
            ["V04", "色彩比例", "橙红不超过 5%，金色约 6%，蓝紫形成主要空间光；没有大面积同色渐变", "视觉设计"],
            ["V05", "文字密度", "45° 章节最多 1 个标题、2 句说明、3 个卖点；不透支首屏", "内容、设计"],
            ["V06", "响应式", "手机不使用上下分栏卡片；文字位于安全区；鼠标跟随关闭", "设计、研发"],
            ["V07", "性能降级", "低动态模式保留全部信息；低性能设备优先关闭粒子和视差", "研发"],
            ["V08", "购买区", "日常价 799 元清晰可见；京东、天猫并列；无促销标签污染上方叙事", "产品、设计"],
            ["V09", "概念声明", "页脚保留模拟声明，视觉权重低于购买信息", "内容运营"],
            ["V10", "页面连续性", "所有锚点停留在同一长页；滚动和导航不触发页级跳转", "产品、研发"],
        ],
        [0.62, 1.28, 4.16, 1.01],
        centers={0, 3},
        body_sizes=[8.3, 8.3, 8.1, 8.1],
    )

    add_heading(doc, "14 素材边界与待确认", page_break_before=True)
    add_table(
        doc,
        ["编号", "事项", "当前结论", "对视觉的影响", "处理阶段"],
        [
            ["O01", "正式 Logo", "未确定，暂用 NEXUS 标准字", "导航和页脚先使用文字标识", "视觉设计"],
            ["O02", "任意角度鼠标旋转", "现有帧序列不能支持真实自由 3D 旋转", "首版只做有限视差、光照位移和轻微角度变化", "3D 资产评审"],
            ["O03", "平台兼容图标", "未提供", "概念选择器先用文字标签，不绘制近似品牌 Logo", "上线素材阶段"],
            ["O04", "配置软件与宏界面", "未提供", "一键切换章节中的软件界面只做概念演示，必须标注模拟", "内容设计"],
            ["O05", "充电底座画面", "未提供", "仅在完整规格和包装清单中出现，不虚构产品图像", "产品素材阶段"],
            ["O06", "画面构图留白", "设计师自定", "先按 45° 朝向确定文字侧，再微调标题位置", "视觉稿阶段"],
            ["O07", "正式京东 / 天猫链接", "模拟项目不接入真实跳转", "按钮保留完整视觉状态，但仅提供模拟反馈", "不执行"],
        ],
        [0.60, 1.28, 1.85, 2.28, 0.96],
        centers={0, 4},
        body_sizes=[8.1, 8.1, 8.0, 8.0, 8.0],
    )

    add_heading(doc, "15 来源与设计输入")
    add_table(
        doc,
        ["类别", "内容", "用途"],
        [
            ["需求文档", "Nexus 官网需求说明书 v1.1，2026-09-24", "单页结构、功能优先级、购买区和模拟边界"],
            ["视觉参考", "Podium、Otherlife、Insta360 Luna Ultra、Shopify Editions、Royal Bev", "设计语言解构与参考权重"],
            ["结构输入", "Insta360 Luna Ultra 官网单页结构与固定锚点导航", "取消独立详情页；所有章节保持在同一长页面"],
            ["产品素材", "416 张 WebP 产品帧，1600 × 900", "产品外观、色彩、光线和分镜权威来源"],
            ["交互输入", "用户明确喜欢 Otherlife 的跟随鼠标运动动效", "单页整场景跟随与空间层次的直接依据"],
            ["未获取项", "Logo、平台图标、配置软件界面、充电底座和真实电商链接", "采用文字、定帧或概念模拟，不虚构真实资产"],
        ],
        [1.18, 2.68, 2.81],
        first_center=True,
        body_sizes=[8.7, 8.5, 8.5],
    )
    add_body(
        doc,
        "本文件作为下一阶段高保真视觉稿和前端原型的设计输入。若产品帧、Logo 或参考权重发生变化，应先更新本文件的变更记录，再进入页面制作。",
    )

    doc.save(DOCX_PATH)


if __name__ == "__main__":
    build_document()
    print(DOCX_PATH)
