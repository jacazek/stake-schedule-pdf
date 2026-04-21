const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function monthToMonthDate(month) {
  const monthNum = MONTH_NAMES.indexOf(month.trim());
  return `${monthNum + 1}/1/2026`;
}

/**
 * Merge units, speakers, speaking assignments, ministering, presidency assignments,
 * and providing speakers into a UnitSchedule array.
 * @param {Array<Object>} units - Rows from units.csv
 * @param {Array<Object>} speakers - Rows from speakers.csv
 * @param {Array<Object>} speakingAssignments - Rows from speaking-assignments.csv
 * @param {Array<Object>} presidencyAssignments - Rows from stake_presidency_speaking_assignments.csv
 * @param {Array<Object>} providingSpeakers - Rows from unit_provide_speakers.csv
 * @param {Array<Object>} ministering - Rows from unit-ministering.csv
 * @returns {Array<Object>} Sorted unit schedule array
 */
export function mapUnitSchedule(
  units,
  speakers,
  speakingAssignments,
  presidencyAssignments,
  providingSpeakers,
  ministering,
) {
  // Build speaker lookup: speaker_id → speaker row
  const speakerMap = new Map();
  for (const s of speakers) {
    if (!s.speaker_id) continue;
    speakerMap.set(s.speaker_id.trim(), s);
  }

  // Group ministering by unit_id (filter empty rows)
  const ministeringByUnit = new Map();
  for (const m of ministering) {
    if (!m.unit_id) continue;
    const key = m.unit_id.trim();
    if (!ministeringByUnit.has(key)) ministeringByUnit.set(key, []);
    ministeringByUnit.get(key).push({
      date: String(m.date_time).trim(),
      location: String(m.location).trim(),
      member: String(m.stake_presidency_member).trim(),
      interviewee: String(m.interviewee).trim(),
      interviewee_name: String(m.interviewee_name).trim(),
    });
  }

  // Group speaking assignments by unit_id (filter empty rows)
  const assignmentsByUnit = new Map();
  for (const a of speakingAssignments) {
    if (!a.unit_id || !a.speaker_id) continue;
    const key = a.unit_id.trim();
    if (!assignmentsByUnit.has(key)) assignmentsByUnit.set(key, []);
    assignmentsByUnit.get(key).push({
      speaker_id: String(a.speaker_id).trim(),
      date: String(a.date).trim(),
    });
  }

  // Group presidency assignments by unit_id (filter empty rows)
  const presidencyByUnit = new Map();
  for (const p of presidencyAssignments) {
    if (!p.unit_id || !p.month) continue;
    const key = p.unit_id.trim();
    if (!presidencyByUnit.has(key)) presidencyByUnit.set(key, []);
    presidencyByUnit.get(key).push({
      month: String(p.month).trim(),
      stake_presidency_member: String(p.stake_presidency_member).trim(),
    });
  }

  // Build output: one entry per unit
  const result = units
    .filter((u) => u.unit_id)
    .map((u) => {
      const unitId = u.unit_id.trim();
      const unitMinistering = ministeringByUnit.get(unitId) ?? [];
      const unitAssignments = assignmentsByUnit.get(unitId) ?? [];
      const unitPresidency = presidencyByUnit.get(unitId) ?? [];

      // Filter eqpMeetings (interviewee = "EQP"), sorted by date
      const eqpMeetings = unitMinistering
        .filter((m) => m.interviewee === "EQP")
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((m) => ({ date: m.date, location: m.location, member: m.member }));

      // Filter leaderMeetings (interviewee = "Bishop" or "BP"), sorted by date
      const leaderMeetings = unitMinistering
        .filter((m) => m.interviewee === "Bishop" || m.interviewee === "BP")
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((m) => ({ date: m.date, location: m.location, member: m.member }));

      // Determine leaderType from interviewee code
      let leaderType = null;
      const bishopRows = unitMinistering.filter(
        (m) => m.interviewee === "Bishop" || m.interviewee === "BP",
      );
      if (bishopRows.length > 0) {
        leaderType =
          bishopRows[0].interviewee === "BP" ? "Branch President" : "Bishop";
      }

      // Build stakeCouncilSpeakers with name resolution, sorted by date
      const stakeCouncilSpeakers = unitAssignments
        .map((a) => {
          const speaker = speakerMap.get(a.speaker_id);
          let name;
          if (
            a.speaker_id === "YM" ||
            a.speaker_id === "YW" ||
            a.speaker_id === "RS" ||
            a.speaker_id === "SS"
          ) {
            name = a.speaker_id;
          } else if (speaker) {
            name = speaker.abbreviated_name;
          } else {
            name = a.speaker_id;
          }
          return { name, date: a.date };
        })
        .sort((a, b) => a.date.localeCompare(b.date));

      // Build stakePresidencySpeakers with month-to-date conversion, sorted by month order
      const stakePresidencySpeakers = unitPresidency
        .map((p) => ({
          name: p.stake_presidency_member,
          date: monthToMonthDate(p.month),
          monthIndex: MONTH_NAMES.indexOf(p.month),
        }))
        .sort((a, b) => a.monthIndex - b.monthIndex)
        .map(({ monthIndex: _, ...item }) => item);

      // Build result object
      const entry = {
        id: unitId,
        name: String(u.unit_name).trim(),
        eqpMeetings,
        leaderMeetings,
        leaderType,
        stakeCouncilSpeakers,
        conferenceDate: String(u.conference_date).trim(),
        stakePresidencySpeakers,
      };

      // Add receivingSpeakers for ERS and ROX only
      if (unitId === "ERS" || unitId === "ROX") {
        entry.receivingSpeakers = providingSpeakers
          .filter((p) => p.month)
          .sort(
            (a, b) =>
              MONTH_NAMES.indexOf(a.month.trim()) -
              MONTH_NAMES.indexOf(b.month.trim()),
          )
          .map((p) => ({
            name: String(p.unit_id).trim(),
            date: monthToMonthDate(p.month),
          }));
      }

      // Add providingSpeakers for all units except FSLG
      if (unitId !== "FSLG" && providingSpeakers.length > 0) {
        entry.providingSpeakers = providingSpeakers
          .filter((p) => p.unit_id == unitId)
          .map((p) => ({
            name: "ERS, ROX",
            date: monthToMonthDate(p.month),
            monthIndex: MONTH_NAMES.indexOf(p.month),
          }))
          .sort((a, b) => a.monthIndex - b.monthIndex)
          .map(({ monthIndex: _, ...item }) => item);
      }

      return entry;
    });

  // Sort lexicographically by id
  result.sort((a, b) => a.id.localeCompare(b.id));

  return result;
}
