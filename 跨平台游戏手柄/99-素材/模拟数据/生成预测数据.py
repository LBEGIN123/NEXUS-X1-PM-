# -*- coding: utf-8 -*-
"""
生成“预测版”问卷数据。

用途：真实问卷回收前，给产品方案阶段一个可计算、可复算的输入。
限制：全部为程序生成，每行带 数据性质=模拟，不得作为调研证据引用。
"""
import csv
import os
import random

SEED = 20260922
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "问卷预测数据.csv")

rng = random.Random(SEED)

INTENT = ["一定买", "可能买", "说不清", "可能不买", "一定不买"]
INTEREST = ["非常不感兴趣", "不太感兴趣", "说不清", "比较感兴趣", "非常感兴趣"]

GROUPS = [
    ("A 主机为主", 90),
    ("B PC 为主", 90),
    ("C 移动+多平台", 70),
    ("D 流失用户", 50),
]

# 各样本组的价格意愿偏移（按配额加权后整体偏移接近 0）
TOP2_SHIFT = {"A 主机为主": 0.06, "B PC 为主": 0.03, "C 移动+多平台": 0.03, "D 流失用户": -0.24}

# 价格阶梯基准 Top-2（低到高）
PRICE_BASE = {599: 0.68, 639: 0.54, 699: 0.44, 799: 0.30, 899: 0.17}
PRICES = [599, 639, 699, 799, 899]

SWITCH_FREQ = ["每天多次", "每天", "每周", "每月", "几乎不"]
PHONE = ["iPhone 15 及以后", "iPhone 14 及以下", "Android", "其他"]
WEIGHT = ["200g 以下", "200–250g", "250–300g", "300g 以上", "无所谓"]
NFC = ["经常", "偶尔", "从不用", "没有 Switch"]
PLATFORMS = ["1 个", "2 个", "3 个", "4 个及以上"]
HOURS = ["3–7 小时", "7–14 小时", "14 小时以上"]
SUSPECT = ["价格偏高", "续航", "授权与兼容性", "手感需实机验证", "品控与耐用", "无明显怀疑"]

# C4 八项痛点基准均值（1–5 分）
PAIN_BASE = {
    "换平台重新配对": 4.20,
    "按键符号不一致": 3.55,
    "一柄只能伺候一平台": 3.80,
    "摇杆漂移": 3.85,
    "按键失灵": 3.95,
    "无线断连": 3.80,
    "续航不足": 3.55,
    "改键软件难用": 3.20,
}
PAIN_SWITCH = ["换平台重新配对", "按键符号不一致", "一柄只能伺候一平台"]
PAIN_QUALITY = ["摇杆漂移", "按键失灵", "无线断连", "续航不足"]

GROUP_PAIN_DELTA = {
    "A 主机为主": {"续航不足": 0.20, "摇杆漂移": 0.20},
    "B PC 为主": {"改键软件难用": 0.15, "按键失灵": 0.10},
    "C 移动+多平台": {"换平台重新配对": 0.35, "按键符号不一致": 0.35, "一柄只能伺候一平台": 0.35},
    "D 流失用户": {"无线断连": 0.45, "按键失灵": 0.35, "续航不足": 0.10},
}

GROUP_D1B = {
    # 一键切换 / 不用重新改键 / 可换键帽 / 三模连接 / 充电底座 / 都不吸引
    "A 主机为主": [0.36, 0.18, 0.10, 0.15, 0.08, 0.13],
    "B PC 为主": [0.41, 0.19, 0.09, 0.14, 0.06, 0.11],
    "C 移动+多平台": [0.50, 0.18, 0.07, 0.11, 0.06, 0.08],
    "D 流失用户": [0.34, 0.16, 0.07, 0.09, 0.04, 0.30],
}
GROUP_D1B_OPTIONS = ["一键切换", "不用重新改键", "可更换键帽布局", "三模连接", "充电底座", "都不吸引"]

GROUP_SWITCH_FREQ = {
    "A 主机为主": [0.14, 0.24, 0.36, 0.18, 0.08],
    "B PC 为主": [0.18, 0.26, 0.34, 0.16, 0.06],
    "C 移动+多平台": [0.38, 0.32, 0.22, 0.06, 0.02],
    "D 流失用户": [0.08, 0.16, 0.30, 0.24, 0.22],
}

GROUP_PHONE = {
    "A 主机为主": [0.42, 0.27, 0.28, 0.03],
    "B PC 为主": [0.40, 0.26, 0.31, 0.03],
    "C 移动+多平台": [0.34, 0.31, 0.33, 0.02],
    "D 流失用户": [0.30, 0.30, 0.37, 0.03],
}

GROUP_SUSPECT = {
    "A 主机为主": [0.16, 0.16, 0.22, 0.24, 0.14, 0.08],
    "B PC 为主": [0.19, 0.14, 0.17, 0.26, 0.14, 0.10],
    "C 移动+多平台": [0.22, 0.15, 0.16, 0.24, 0.14, 0.09],
    "D 流失用户": [0.18, 0.13, 0.14, 0.16, 0.32, 0.07],
}


def pick(options, weights):
    r = rng.random()
    acc = 0.0
    for opt, w in zip(options, weights):
        acc += w
        if r <= acc:
            return opt
    return options[-1]


def intent_from_u(u, top2):
    """价格容忍度模型：u 越小越愿意买，u < top2 即进入 Top-2。"""
    top2 = min(0.95, max(0.02, top2))
    if u < top2:
        return "一定买" if (u / top2) < 0.40 else "可能买"
    rest = 1.0 - top2
    ratio = (u - top2) / rest if rest > 0 else 1.0
    if ratio < 0.35:
        return "说不清"
    if ratio < 0.78:
        return "可能不买"
    return "一定不买"


def pain_score(name, group):
    mean = PAIN_BASE[name] + GROUP_PAIN_DELTA.get(group, {}).get(name, 0.0)
    return max(1, min(5, int(round(rng.gauss(mean, 0.95)))))


def main():
    rows = []
    n = 0
    for group, quota in GROUPS:
        for _ in range(quota):
            n += 1
            freq = pick(SWITCH_FREQ, GROUP_SWITCH_FREQ[group])
            # 高频切换者的一键切换偏好更强
            d1b_w = list(GROUP_D1B[group])
            if freq in ("每天多次", "每天"):
                move = d1b_w[0] * 0.18
                d1b_w[0] += move
                d1b_w[5] = max(0.01, d1b_w[5] - move)
            d1b = pick(GROUP_D1B_OPTIONS, d1b_w)

            shift = TOP2_SHIFT[group]
            if d1b == "一键切换":
                shift += 0.05
            if freq in ("每天多次", "每天"):
                shift += 0.03

            # 每个人一个价格容忍度，价格越高意愿单调下降，且各档边际比例等于基准值
            u = rng.random()
            ladder = {price: intent_from_u(u, PRICE_BASE[price] + shift) for price in PRICES}

            top2_799 = ladder[799] in ("一定买", "可能买")
            if top2_799:
                interest = pick(INTEREST, [0, 0, 0.10, 0.52, 0.38])
            elif ladder[799] == "说不清":
                interest = pick(INTEREST, [0.02, 0.10, 0.40, 0.38, 0.10])
            else:
                interest = pick(INTEREST, [0.08, 0.32, 0.36, 0.19, 0.05])

            row = {
                "受访编号": "S%03d" % n,
                "数据性质": "模拟",
                "样本组": group,
                "每周时长": pick(HOURS, [0.34, 0.40, 0.26]),
                "平台数": pick(PLATFORMS, [0.08, 0.38, 0.34, 0.20]),
                "切换频率": freq,
                "手机": pick(PHONE, GROUP_PHONE[group]),
            }
            for name in PAIN_BASE:
                row["C4_" + name] = pain_score(name, group)
            row["D1a_兴趣"] = interest
            row["D1b_最吸引"] = d1b
            row["D1c_怀疑点"] = pick(SUSPECT, GROUP_SUSPECT[group])
            for price in PRICES:
                row["D2_%d" % price] = ladder[price]
            row["E3_重量上限"] = pick(WEIGHT, [0.12, 0.46, 0.33, 0.05, 0.04])
            row["F1_NFC"] = pick(NFC, [0.14, 0.27, 0.40, 0.19])
            rows.append(row)

    fields = list(rows[0].keys())
    with open(OUT, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)
    print("已生成 %d 行 -> %s" % (len(rows), OUT))


if __name__ == "__main__":
    main()
