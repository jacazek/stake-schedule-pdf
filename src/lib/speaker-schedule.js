/**
 * Merge speakers, speaking assignments, and ministering interviews into a SpeakerSchedule.
 * @param {Array<Object>} speakers - Rows from speakers.csv
 * @param {Array<Object>} speakingAssignments - Rows from speaking-assignments.csv
 * @param {Array<Object>} ministering - Rows from speaker-ministering.csv
 * @param {Array<Object>} units - Rows from units.csv
 * @returns {Array<Object>} Sorted speaker schedule array
 */
export function mapSpeakerSchedule(speakers, speakingAssignments, ministering, units) {
  // Build unit lookup: unit_id -> unit_abbrev
  const unitMap = new Map(units.map(u => [u.unit_id, u.unit_abbrev]));

  // Group assignments by speaker_id (filter empty rows)
  const assignmentsBySpeaker = new Map();
  for (const a of speakingAssignments) {
    if (!a.speaker_id) continue;
    if (!assignmentsBySpeaker.has(a.speaker_id)) assignmentsBySpeaker.set(a.speaker_id, []);
    assignmentsBySpeaker.get(a.speaker_id).push({
      date: String(a.date).trim(),
      unit: String(unitMap.get(a.unit_id) ?? a.unit_id).trim(),
      note: String(a.notes ?? '').trim(),
    });
  }

  // Group ministering by interviewee (filter empty rows)
  const ministeringByInterviewee = new Map();
  for (const m of ministering) {
    if (!m.interviewee) continue;
    if (!ministeringByInterviewee.has(m.interviewee)) ministeringByInterviewee.set(m.interviewee, []);
    ministeringByInterviewee.get(m.interviewee).push({
      dateTime: String(m.datetime).trim(),
      location: String(m.location).trim(),
      note: String(m.note ?? '').trim(),
    });
  }

  // Build output: one entry per speaker
  const result = speakers
    .filter(s => s.speaker_id)
    .map(s => ({
      id: String(s.speaker_id).trim(),
      name: String(s.full_name).trim(),
      tocName: String(s.toc_name).trim(),
      speakingAssignments: assignmentsBySpeaker.get(s.speaker_id) ?? [],
      ministeringInterviews: ministeringByInterviewee.get(s.speaker_id) ?? [],
    }));

  // Sort lexicographically by id
  result.sort((a, b) => a.id.localeCompare(b.id));

  return result;
}
