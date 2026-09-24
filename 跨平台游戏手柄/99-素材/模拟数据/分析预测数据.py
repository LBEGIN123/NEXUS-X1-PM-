# -*- coding: utf-8 -*-
"""按 02-需求调研/分析口径与决策阈值.md 的预登记规则，计算预测数据的全部指标。"""
import csv
import os
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "问卷预测数据.csv")
OUT = os.path.join(ROOT, "分析输出.txt")

PRICES = [599, 639, 699, 799, 899]
TOP2 = ("一定买", "可能买")
PAIN_SWITCH = ["换平台重新配对", "按键符号不一致", "一柄只能伺候一平台"]
PAIN_QUALITY = ["摇杆漂移", "按键失灵", "无线断连", "续航不足"]


def load():
    with open(SRC, encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def pct(a, b):
    return 0.0 if b == 0 else 100.0 * a / b


def bar(value, scale=5.0):
    return "#" * int(round(value / scale * 30))


def main():
    rows = load()
    n = len(rows)
    assert all(r["数据性质"] == "模拟" for r in rows), "数据性质字段异常"
    out = []
    out.append("样本量：%d（数据性质=模拟，非真实调研结果）" % n)

    # 1 样本配额
    out.append("\n== 1 样本配额达成 ==")
    for g, c in Counter(r["样本组"] for r in rows).most_common():
        out.append("  %-14s %3d" % (g, c))

    # 2 价格阶梯
    out.append("\n== 2 购买意愿 Top-2 Box（Gabor-Granger） ==")
    top2 = {}
    for p in PRICES:
        k = "D2_%d" % p
        v = sum(1 for r in rows if r[k] in TOP2)
        top2[p] = pct(v, n)
        out.append("  %4d 元  Top-2 %5.1f%%  折七成 %5.1f%%  %s" % (p, top2[p], top2[p] * 0.7, bar(top2[p], 100)))
    drop = None
    for i in range(1, len(PRICES)):
        delta = top2[PRICES[i - 1]] - top2[PRICES[i]]
        out.append("    %d -> %d 元：%+.1f pt" % (PRICES[i - 1], PRICES[i], -delta))
        if delta > 12 and drop is None:
            drop = PRICES[i]
    out.append("  价格下滑点：%s" % ("%d 元" % drop if drop else "未出现超过 12pt 的降幅"))

    out.append("\n  分样本组 Top-2 Box：")
    groups = sorted(set(r["样本组"] for r in rows))
    header = "    %-14s" % "样本组" + "".join("%9d" % p for p in PRICES)
    out.append(header)
    for g in groups:
        sub = [r for r in rows if r["样本组"] == g]
        line = "    %-14s" % g
        for p in PRICES:
            v = sum(1 for r in sub if r["D2_%d" % p] in TOP2)
            line += "%8.1f%%" % pct(v, len(sub))
        out.append(line)

    # 3 D1a 兴趣
    out.append("\n== 3 D1a 概念兴趣分布 ==")
    order = ["非常感兴趣", "比较感兴趣", "说不清", "不太感兴趣", "非常不感兴趣"]
    c = Counter(r["D1a_兴趣"] for r in rows)
    for k in order:
        out.append("  %-8s %3d  %5.1f%%" % (k, c[k], pct(c[k], n)))
    inter_top2 = c["非常感兴趣"] + c["比较感兴趣"]
    out.append("  兴趣 Top-2：%d  %5.1f%%" % (inter_top2, pct(inter_top2, n)))

    # 4 D1b 吸引点
    out.append("\n== 4 D1b 最有吸引力的一点 ==")
    c = Counter(r["D1b_最吸引"] for r in rows)
    for k, v in c.most_common():
        out.append("  %-14s %3d  %5.1f%%  %s" % (k, v, pct(v, n), bar(pct(v, n), 100)))
    switch_share = pct(c["一键切换"], n)
    out.append("  核心卖点占比（一键切换）：%.1f%%" % switch_share)

    # 5 C4 痛点
    out.append("\n== 5 C4 痛点均值（1–5 分） ==")
    pain_names = [k[3:] for k in rows[0] if k.startswith("C4_")]
    pain_means = {}
    for name in pain_names:
        vals = [int(r["C4_" + name]) for r in rows]
        m = sum(vals) / len(vals)
        pain_means[name] = m
        out.append("  %-18s %.2f  %s" % (name, m, bar(m)))
    sw = sum(pain_means[k] for k in PAIN_SWITCH) / len(PAIN_SWITCH)
    ql = sum(pain_means[k] for k in PAIN_QUALITY) / len(PAIN_QUALITY)
    out.append("  换平台相关条目均值：%.2f" % sw)
    out.append("  质量相关条目均值：%.2f" % ql)

    out.append("\n  分样本组换平台均值（重新配对 / 按键符号 / 一机一平台）：")
    for g in groups:
        sub = [r for r in rows if r["样本组"] == g]
        vals = [sum(int(r["C4_" + k]) for k in PAIN_SWITCH) / len(PAIN_SWITCH) for r in sub]
        out.append("    %-14s %.2f" % (g, sum(vals) / len(vals)))

    # 6 手机结构
    out.append("\n== 6 B2 手机结构 ==")
    c = Counter(r["手机"] for r in rows)
    for k, v in c.most_common():
        out.append("  %-16s %3d  %5.1f%%" % (k, v, pct(v, n)))
    lightning = c["iPhone 14 及以下"]
    out.append("  iPhone 14 及以下占比：%.1f%%" % pct(lightning, n))
    out.append("  分样本组：")
    for g in groups:
        sub = [r for r in rows if r["样本组"] == g]
        v = sum(1 for r in sub if r["手机"] == "iPhone 14 及以下")
        out.append("    %-14s %5.1f%%  (%d/%d)" % (g, pct(v, len(sub)), v, len(sub)))

    # 7 其他分布
    out.append("\n== 7 E3 / F1 / 切换频率 ==")
    for label, key in [("E3 重量上限", "E3_重量上限"), ("F1 NFC 使用", "F1_NFC"), ("C1 切换频率", "切换频率")]:
        out.append("  %s：" % label)
        c = Counter(r[key] for r in rows)
        for k, v in c.most_common():
            out.append("    %-14s %3d  %5.1f%%" % (k, v, pct(v, n)))

    # 8 交叉分析
    out.append("\n== 8 交叉分析 ==")
    freq_high = [r for r in rows if r["切换频率"] in ("每天多次", "每天")]
    c = Counter(r["D1b_最吸引"] for r in freq_high)
    out.append("  高频切换者（%d 人）中最吸引点首位：%s  %.1f%%" % (len(freq_high), c.most_common(1)[0][0], pct(c.most_common(1)[0][1], len(freq_high))))
    out.append("  高频切换者一键切换占比：%.1f%%" % pct(c["一键切换"], len(freq_high)))

    chosen = [r for r in rows if r["D1b_最吸引"] == "一键切换"]
    v = sum(1 for r in chosen if r["D2_799"] in TOP2)
    out.append("  选一键切换者在 799 元档 Top-2：%.1f%%（%d/%d）" % (pct(v, len(chosen)), v, len(chosen)))
    rest = [r for r in rows if r["D1b_最吸引"] != "一键切换"]
    v2 = sum(1 for r in rest if r["D2_799"] in TOP2)
    out.append("  其余人在 799 元档 Top-2：%.1f%%（%d/%d）" % (pct(v2, len(rest)), v2, len(rest)))

    l14 = [r for r in rows if r["手机"] == "iPhone 14 及以下"]
    l15 = [r for r in rows if r["手机"] != "iPhone 14 及以下"]
    for label, sub2 in [("iPhone 14 及以下", l14), ("其余机主", l15)]:
        out.append("\n  %s（%d 人）：" % (label, len(sub2)))
        for p in PRICES:
            v3 = sum(1 for r in sub2 if r["D2_%d" % p] in TOP2)
            out.append("    %4d 元  Top-2 %5.1f%%" % (p, pct(v3, len(sub2))))

    out.append("\n  D 组流失用户怀疑点：")
    sub = [r for r in rows if r["样本组"] == "D 流失用户"]
    c = Counter(r["D1c_怀疑点"] for r in sub)
    for k, v in c.most_common():
        out.append("    %-14s %3d  %5.1f%%" % (k, v, pct(v, len(sub))))

    out.append("\n  换平台痛点 4 分及以上占比：")
    for name in PAIN_SWITCH:
        v4 = sum(1 for r in rows if int(r["C4_" + name]) >= 4)
        out.append("    %-18s %5.1f%%" % (name, pct(v4, n)))

    out.append("\n  兴趣 Top-2 人群的价格阶梯：")
    sub = [r for r in rows if r["D1a_兴趣"] in ("非常感兴趣", "比较感兴趣")]
    for p in PRICES:
        v = sum(1 for r in sub if r["D2_%d" % p] in TOP2)
        out.append("    %4d 元  Top-2 %5.1f%%" % (p, pct(v, len(sub))))

    out.append("\n  怀疑点分布：")
    c = Counter(r["D1c_怀疑点"] for r in rows)
    for k, v in c.most_common():
        out.append("    %-14s %3d  %5.1f%%" % (k, v, pct(v, n)))

    # 9 阈值判定
    out.append("\n== 9 按预登记阈值判定 ==")

    def verdict(name, value, low, mid):
        if value < low:
            res = "需求不成立"
        elif value <= mid:
            res = "需要补充验证"
        else:
            res = "需求成立"
        out.append("  %-28s %6.1f  -> %s" % (name, value, res))

    verdict("Top-2 Box @799 元", top2[799], 25, 40)
    verdict("Top-2 Box @799 折七成", top2[799] * 0.7, 25, 40)
    verdict("核心卖点占比（一键切换）", switch_share, 25, 40)
    verdict("痛点均值（换平台相关）", sw, 3.0, 3.8)
    verdict("iPhone 14 及以下占比", pct(lightning, n), 15, 25)

    text = "\n".join(out)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(text + "\n")
    print(text)


if __name__ == "__main__":
    main()
