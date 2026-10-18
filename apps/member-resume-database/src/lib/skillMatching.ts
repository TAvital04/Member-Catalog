/**
 * @file skillMatching.ts
 * @description Intelligent skill normalization and matching engine.
 * Provides resilient, domain-aware comparison between candidate profile skills
 * and directory query filters/event topic tags.
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
  // Must match as isolated words or exact token to avoid "C" falsely matching inside "React" or "Kickoff"
  if (tLow.length <= 2 || sLow.length <= 2) {
    return sWords.includes(tLow) || tWords.includes(sLow);
  }

  // 3. Known domain engineering synonyms & acronyms
  const isAltium = tLow.includes("altium") && sLow.includes("altium");
  const isFreeRTOS = (tLow.includes("freertos") || tLow.includes("zephyr") || tLow.includes("rtos")) &&
    (sLow.includes("freertos") || sLow.includes("zephyr") || sLow.includes("rtos"));
  const isSolder = tLow.includes("solder") && sLow.includes("solder");
  const isPCB = tLow.includes("pcb") && sLow.includes("pcb");
  const isROS =
    (tLow.includes("ros") || tLow.includes("robot")) &&
    (sLow.includes("ros") || sLow.includes("robot") || sLow.includes("micromouse"));
  const isVision =
    (tLow.includes("vision") || tLow.includes("opencv") || tLow.includes("tensorrt")) &&
    (sLow.includes("vision") || sLow.includes("opencv") || sLow.includes("tensorrt"));
  const isKiCAD = tLow.includes("kicad") && sLow.includes("kicad");
  const isPowerElec =
    (tLow.includes("power elec") || tLow.includes("inverter") || tLow.includes("gan") || tLow.includes("sic")) &&
    (sLow.includes("power elec") || sLow.includes("inverter") || sLow.includes("gan") || sLow.includes("sic"));
  const isRF = (tLow.includes("rf") || tLow.includes("radio freq") || tLow.includes("antenna") || tLow.includes("sdr")) &&
    (sLow.includes("rf") || sLow.includes("radio freq") || sLow.includes("antenna") || sLow.includes("sdr"));
  const isRadar = tLow.includes("radar") && sLow.includes("radar");
  const isFPGA = (tLow.includes("fpga") || tLow.includes("vivado") || tLow.includes("kintex") || tLow.includes("ultrascale")) &&
    (sLow.includes("fpga") || sLow.includes("vivado") || sLow.includes("kintex") || sLow.includes("ultrascale"));
  const isSTM32 = tLow.includes("stm32") && sLow.includes("stm32");
  const isARM = (tLow.includes("arm") || tLow.includes("cortex")) && (sLow.includes("arm") || sLow.includes("cortex"));
  const isEmbedded = tLow.includes("embedded") && sLow.includes("embedded");
  const isSecurity = tLow.includes("security") && sLow.includes("security");
  const isLinux = tLow.includes("linux") && sLow.includes("linux");
  const isDSP = (tLow.includes("dsp") || tLow.includes("signal processing")) &&
    (sLow.includes("dsp") || sLow.includes("signal processing"));
  const isOscilloscope =
    (tLow.includes("oscilloscope") || tLow.includes("probes") || tLow.includes("rigol") || tLow.includes("keysight") || tLow.includes("logic analyzer")) &&
    (sLow.includes("oscilloscope") || sLow.includes("probes") || sLow.includes("rigol") || sLow.includes("keysight") || sLow.includes("logic analyzer"));
  const is3DPrinting = (tLow.includes("3d print") || tLow.includes("bambu") || tLow.includes("additive")) &&
    (sLow.includes("3d print") || sLow.includes("bambu") || sLow.includes("additive"));
  const isBluetooth = (tLow.includes("bluetooth") || tLow.includes("ble") || tLow.includes("nrf52")) &&
    (sLow.includes("bluetooth") || sLow.includes("ble") || sLow.includes("nrf52"));
  const isESP32 = tLow.includes("esp32") && sLow.includes("esp32");
  const isRPI = (tLow.includes("raspberry pi") || tLow.includes("coral") || tLow.includes("edge tpu")) &&
    (sLow.includes("raspberry pi") || sLow.includes("coral") || sLow.includes("edge tpu") || sLow.includes("edge ai"));
  const isPID = (tLow.includes("pid") || tLow.includes("motor control") || tLow.includes("foc")) &&
    (sLow.includes("pid") || sLow.includes("motor control") || sLow.includes("foc") || sLow.includes("control"));
  const isCAD = (tLow.includes("cad") || tLow.includes("solidworks") || tLow.includes("fusion 360") || tLow.includes("mastercam")) &&
    (sLow.includes("cad") || sLow.includes("solidworks") || sLow.includes("fusion 360") || sLow.includes("mastercam"));

  if (
    isAltium ||
    isFreeRTOS ||
    isSolder ||
    isPCB ||
    isROS ||
    isVision ||
    isKiCAD ||
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
    isRPI ||
    isPID ||
    isCAD
  ) {
    return true;
  }

  // 4. Token subset matching (e.g. "Embedded C" matches candidate who has "C" or vice versa)
  const allTInS = tWords.length > 1 && tWords.every((tw) => sWords.includes(tw));
  const allSInT = sWords.length > 1 && sWords.every((sw) => tWords.includes(sw));
  if (allTInS || allSInT) return true;

  // 5. Containment for meaningful strings (>= 4 chars)
  if (tNorm.length >= 4 && sNorm.length >= 4) {
    if (sNorm.includes(tNorm) || tNorm.includes(sNorm)) {
      return true;
    }
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
