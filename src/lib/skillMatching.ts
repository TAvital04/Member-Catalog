/**
 * @file skillMatching.ts
 * @description Intelligent skill normalization and matching engine.
 * Provides resilient, domain-aware comparison between candidate profile skills
 * and directory query filters/event topic tags without overly broad or leaky false positives.
 */

export function normalizeSkill(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\(\)\[\],\/\\_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks whether a candidate's individual skill matches a queried/target skill.
 * Handles casing differences, formatting variations (e.g. "Soldering (SMD 0805/0603)" vs "Soldering"),
 * short language tokens ("C", "Go", "R"), and common hardware/software engineering synonyms.
 */
export function isSkillMatch(candidateSkill: string, targetSkill: string): boolean {
  if (!candidateSkill || !targetSkill) return false;

  const sLow = candidateSkill.toLowerCase().trim();
  const tLow = targetSkill.toLowerCase().trim();

  // 1. Direct case-insensitive match
  if (sLow === tLow) return true;

  const sNorm = normalizeSkill(candidateSkill);
  const tNorm = normalizeSkill(targetSkill);

  if (sNorm === tNorm) return true;

  const sWords = sNorm.split(" ").filter(Boolean);
  const tWords = tNorm.split(" ").filter(Boolean);

  // 2. Short programming languages/acronyms (<= 2 chars like "C", "R", "Go", "JS", "AI")
  if (tLow.length <= 2 || sLow.length <= 2) {
    if (tWords.includes("c") && sWords.includes("c")) return true;
    if (tWords.includes("go") && sWords.includes("go")) return true;
    if (tWords.includes("r") && sWords.includes("r")) return true;
    if (tWords.includes("js") && sWords.includes("js")) return true;
    if (tWords.includes("ai") && sWords.includes("ai")) return true;
  }

  // 3. C / C++ and Embedded C special handling
  const isTargetCCombined =
    tLow.includes("c++ / c") ||
    tLow.includes("c / c++") ||
    (tWords.includes("c++") && tWords.includes("c"));
  const isCandidateCCombined =
    sLow.includes("c++ / c") ||
    sLow.includes("c / c++") ||
    (sWords.includes("c++") && sWords.includes("c"));

  const targetHasCpp = tWords.includes("c++") || tWords.includes("cpp");
  const candHasCpp = sWords.includes("c++") || sWords.includes("cpp");
  const targetHasC =
    tWords.includes("c") || tWords.includes("embedded c") || tLow.includes("bare-metal c");
  const candHasC =
    sWords.includes("c") || sWords.includes("embedded c") || sLow.includes("bare-metal c");

  if (isTargetCCombined && (candHasCpp || candHasC)) return true;
  if (isCandidateCCombined && (targetHasCpp || targetHasC)) return true;
  if (targetHasCpp && candHasCpp) return true;
  if (targetHasC && candHasC) return true;

  // 4. Known domain engineering synonyms & acronyms (targeted without generic leakage)
  const isAltium = tLow.includes("altium") && sLow.includes("altium");
  const isKiCAD = tLow.includes("kicad") && sLow.includes("kicad");
  const isFreeRTOS =
    (tLow.includes("freertos") || tLow.includes("zephyr") || tLow.includes("rtos")) &&
    (sLow.includes("freertos") || sLow.includes("zephyr") || sLow.includes("rtos"));
  const isSolder =
    (tLow.includes("solder") || tLow.includes("smd rework") || tLow.includes("reflow") || tLow.includes("stencil")) &&
    (sLow.includes("solder") || sLow.includes("smd rework") || sLow.includes("reflow") || sLow.includes("stencil"));
  const isPCB =
    (tLow.includes("pcb") || tLow.includes("schematic") || tLow.includes("gerber")) &&
    (sLow.includes("pcb") || sLow.includes("schematic") || sLow.includes("gerber") || sLow.includes("kicad") || sLow.includes("altium"));
  const isCAN =
    (tLow.includes("can bus") || tLow.includes("can 2.0") || tLow.includes("canalyzer") || (tWords.includes("can") && tWords.includes("bus"))) &&
    (sLow.includes("can bus") || sLow.includes("can 2.0") || sLow.includes("canalyzer") || (sWords.includes("can") && sWords.includes("bus")));
  const isROS =
    (tLow.includes("ros") || tLow.includes("ros2")) &&
    (sLow.includes("ros") || sLow.includes("ros2"));
  const isVision =
    (tLow.includes("opencv") && sLow.includes("opencv")) ||
    (tLow.includes("computer vision") && (sLow.includes("computer vision") || sLow.includes("opencv") || sLow.includes("vision"))) ||
    (tLow.includes("tensorrt") && sLow.includes("tensorrt"));
  const isPyTorch = tLow.includes("pytorch") && sLow.includes("pytorch");
  const isPowerElec =
    (tLow.includes("power elec") || tLow.includes("inverter") || tLow.includes("gan") || tLow.includes("sic") || tLow.includes("high-voltage") || tLow.includes("mosfet")) &&
    (sLow.includes("power elec") || sLow.includes("inverter") || sLow.includes("gan") || sLow.includes("sic") || sLow.includes("battery management") || sLow.includes("clean energy"));
  const isRF =
    (tLow.includes("rf") || tLow.includes("radio freq") || tLow.includes("antenna") || tLow.includes("sdr") || tLow.includes("gnu radio") || tLow.includes("vna") || tLow.includes("microstrip")) &&
    (sLow.includes("rf") || sLow.includes("radio freq") || sLow.includes("antenna") || sLow.includes("sdr") || sLow.includes("gnu radio") || sLow.includes("vna") || sLow.includes("microstrip"));
  const isRadar = tLow.includes("radar") && sLow.includes("radar");
  const isFPGA =
    (tLow.includes("fpga") || tLow.includes("vivado") || tLow.includes("verilog") || tLow.includes("systemverilog") || tLow.includes("kintex") || tLow.includes("ultrascale")) &&
    (sLow.includes("fpga") || sLow.includes("vivado") || sLow.includes("verilog") || sLow.includes("systemverilog") || sLow.includes("kintex") || sLow.includes("ultrascale"));
  const isSTM32 =
    (tLow.includes("stm32") && sLow.includes("stm32")) ||
    (tLow.includes("cortex-m") && (sLow.includes("cortex-m") || sLow.includes("stm32") || sLow.includes("arm cortex")));
  const isARM = (tLow.includes("arm") || tLow.includes("cortex")) && (sLow.includes("arm") || sLow.includes("cortex"));
  const isEmbedded =
    (tLow.includes("embedded") || tLow.includes("firmware") || tLow.includes("microcontroller")) &&
    (sLow.includes("embedded") || sLow.includes("firmware") || sLow.includes("microcontroller"));
  const isSecurity =
    (tLow.includes("security") || tLow.includes("crypto") || tLow.includes("side-channel") || tLow.includes("wireshark")) &&
    (sLow.includes("security") || sLow.includes("crypto") || sLow.includes("side-channel") || sLow.includes("wireshark"));
  const isLinux =
    (tLow.includes("linux") || tLow.includes("kernel")) &&
    (sLow.includes("linux") || sLow.includes("kernel"));
  const isDSP =
    (tLow.includes("dsp") || tLow.includes("signal processing")) &&
    (sLow.includes("dsp") || sLow.includes("signal processing"));
  const isOscilloscope =
    (tLow.includes("oscilloscope") || tLow.includes("rigol") || tLow.includes("keysight") || tLow.includes("logic analyzer")) &&
    (sLow.includes("oscilloscope") || sLow.includes("rigol") || sLow.includes("keysight") || sLow.includes("logic analyzer") || sLow.includes("multimeter & oscilloscope"));
  const is3DPrinting =
    (tLow.includes("3d print") || tLow.includes("bambu") || tLow.includes("additive")) &&
    (sLow.includes("3d print") || sLow.includes("bambu") || sLow.includes("additive"));
  const isBluetooth =
    (tLow.includes("bluetooth") || tLow.includes("ble") || tLow.includes("nrf52")) &&
    (sLow.includes("bluetooth") || sLow.includes("ble") || sLow.includes("nrf52"));
  const isESP32 = tLow.includes("esp32") && sLow.includes("esp32");
  const isEdgeAI =
    (tLow.includes("edge ai") || tLow.includes("edge tpu") || tLow.includes("coral")) &&
    (sLow.includes("edge ai") || sLow.includes("edge tpu") || sLow.includes("coral"));
  const isPID =
    (tLow.includes("pid") || tLow.includes("motor control") || tLow.includes("foc") || tLow.includes("vector control")) &&
    (sLow.includes("pid") || sLow.includes("motor control") || sLow.includes("foc") || sLow.includes("vector control"));
  const isCAD =
    (tLow.includes("cad") || tLow.includes("solidworks") || tLow.includes("fusion 360")) &&
    (sLow.includes("cad") || sLow.includes("solidworks") || sLow.includes("fusion 360"));
  const isDrone =
    (tLow.includes("px4") || tLow.includes("mavlink") || tLow.includes("drone") || tLow.includes("quadcopter") || tLow.includes("autopilot")) &&
    (sLow.includes("px4") || sLow.includes("mavlink") || sLow.includes("drone") || sLow.includes("quadcopter") || sLow.includes("autopilot"));
  const isRISCV =
    (tLow.includes("risc-v") || tLow.includes("riscv") || tLow.includes("ch32v")) &&
    (sLow.includes("risc-v") || sLow.includes("riscv") || sLow.includes("ch32v"));
  const isWeb =
    (tLow.includes("next.js") || tLow.includes("nextjs") || tLow.includes("typescript") || tLow.includes("react")) &&
    (sLow.includes("next.js") || sLow.includes("nextjs") || sLow.includes("typescript") || sLow.includes("react"));
  const isDatabase =
    (tLow.includes("postgresql") || tLow.includes("postgres") || tLow.includes("sql") || tLow.includes("database")) &&
    (sLow.includes("postgresql") || sLow.includes("postgres") || sLow.includes("sql") || sLow.includes("database"));
  const isAlgorithms =
    (tLow.includes("algorithm") || tLow.includes("dijkstra") || tLow.includes("flood-fill") || tLow.includes("graph search")) &&
    (sLow.includes("algorithm") || sLow.includes("dijkstra") || sLow.includes("flood-fill") || sLow.includes("graph"));
  const isSensors =
    (tLow.includes("sensor") || tLow.includes("tof") || tLow.includes("time-of-flight") || tLow.includes("bme688")) &&
    (sLow.includes("sensor") || sLow.includes("tof") || sLow.includes("time-of-flight") || sLow.includes("telemetry"));

  if (
    isAltium ||
    isKiCAD ||
    isFreeRTOS ||
    isSolder ||
    isPCB ||
    isCAN ||
    isROS ||
    isVision ||
    isPyTorch ||
    isPowerElec ||
    isRF ||
    isRadar ||
    isFPGA ||
    isSTM32 ||
    isARM ||
    isEmbedded ||
    isSecurity ||
    isLinux ||
    isDSP ||
    isOscilloscope ||
    is3DPrinting ||
    isBluetooth ||
    isESP32 ||
    isEdgeAI ||
    isPID ||
    isCAD ||
    isDrone ||
    isRISCV ||
    isWeb ||
    isDatabase ||
    isAlgorithms ||
    isSensors
  ) {
    return true;
  }

  // 5. Token subset matching (requires at least 2 non-trivial words)
  const stopWords = new Set(["and", "the", "for", "with", "using", "design", "development", "over", "into", "on", "in", "of"]);
  const nonTrivialSWords = sWords.filter((w) => w.length >= 2 && !stopWords.has(w));
  const nonTrivialTWords = tWords.filter((w) => w.length >= 2 && !stopWords.has(w));

  if (nonTrivialSWords.length >= 2 && nonTrivialSWords.every((sw) => tWords.includes(sw))) {
    return true;
  }
  if (nonTrivialTWords.length >= 2 && nonTrivialTWords.every((tw) => sWords.includes(tw))) {
    return true;
  }

  // 6. Substring phrase matching with word boundaries
  if (tNorm.length >= 4 && sNorm.length >= 4) {
    if (sNorm === tNorm) return true;
    if (sNorm.startsWith(tNorm + " ") || sNorm.endsWith(" " + tNorm) || sNorm.includes(" " + tNorm + " ")) return true;
    if (tNorm.startsWith(sNorm + " ") || tNorm.endsWith(" " + sNorm) || tNorm.includes(" " + sNorm + " ")) return true;
  }

  return false;
}

/**
 * Checks if a candidate possesses a given target skill across their listed skills.
 */
export function studentHasSkill(studentSkills: string[] | undefined, targetSkill: string): boolean {
  if (!studentSkills || !Array.isArray(studentSkills) || studentSkills.length === 0) {
    return false;
  }
  return studentSkills.some((skill) => isSkillMatch(skill, targetSkill));
}
