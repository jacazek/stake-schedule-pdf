import assert from 'node:assert';
import { mapSpeakerSchedule } from './speaker-schedule.js';

// Test 1: Basic speaker mapping with speaking assignments and ministering
const test1Speakers = [
  { speaker_id: 'HC1', full_name: 'Jon Hale', toc_name: 'Hale', abbreviated_name: 'Hale' },
];
const test1Assignments = [
  { unit_id: 'ERS', speaker_id: 'HC1', date: '05/17/26', notes: '' },
];
const test1Ministering = [
  { interviewee: 'HC1', stake_presidency_member: 'Lee', datetime: '05/27/2026 08:30 PM', location: 'Durham Stake Center', note: '' },
];
const test1Units = [
  { unit_id: 'ERS', conference_date: '01/11/26', unit_name: 'Eno River Branch (Spanish)', unit_abbrev: 'Eno River' },
];

const result1 = mapSpeakerSchedule(test1Speakers, test1Assignments, test1Ministering, test1Units);

assert.strictEqual(result1.length, 1);
assert.strictEqual(result1[0].id, 'HC1');
assert.strictEqual(result1[0].name, 'Jon Hale');
assert.strictEqual(result1[0].tocName, 'Hale');
assert.strictEqual(result1[0].speakingAssignments.length, 1);
assert.strictEqual(result1[0].speakingAssignments[0].date, '05/17/26');
assert.strictEqual(result1[0].speakingAssignments[0].unit, 'Eno River');
assert.strictEqual(result1[0].speakingAssignments[0].note, '');
assert.strictEqual(result1[0].ministeringInterviews.length, 1);
assert.strictEqual(result1[0].ministeringInterviews[0].dateTime, '05/27/2026 08:30 PM');
assert.strictEqual(result1[0].ministeringInterviews[0].location, 'Durham Stake Center');
assert.strictEqual(result1[0].ministeringInterviews[0].note, '');

// Test 2: Unit lookup fallback to raw unit_id when not in units.csv
const test2Speakers = [
  { speaker_id: 'HC6', full_name: 'Jonathan Isgett', toc_name: 'Isgett', abbreviated_name: 'Isgett' },
];
const test2Assignments = [
  { unit_id: 'FSLG', speaker_id: 'HC6', date: '01/18/26', notes: '' },
];
const test2Ministering = [];
const test2Units = [
  { unit_id: 'ERS', conference_date: '01/11/26', unit_name: 'Eno River Branch (Spanish)', unit_abbrev: 'Eno River' },
];

const result2 = mapSpeakerSchedule(test2Speakers, test2Assignments, test2Ministering, test2Units);

assert.strictEqual(result2[0].speakingAssignments[0].unit, 'FSLG');

// Test 3: Speakers with no speaking assignments get empty array
const test3Speakers = [
  { speaker_id: 'SS', full_name: 'Stake Sunday School', toc_name: 'Stake Sunday School', abbreviated_name: 'Stake Sunday School' },
];
const test3Assignments = [];
const test3Ministering = [];
const test3Units = [];

const result3 = mapSpeakerSchedule(test3Speakers, test3Assignments, test3Ministering, test3Units);

assert.strictEqual(result3.length, 1);
assert.deepStrictEqual(result3[0].speakingAssignments, []);
assert.deepStrictEqual(result3[0].ministeringInterviews, []);

// Test 4: Sort order is lexicographic by id
const test4Speakers = [
  { speaker_id: 'HC10', full_name: 'Peter Gayek', toc_name: 'Gayek', abbreviated_name: 'Gayek' },
  { speaker_id: 'HC1', full_name: 'Jon Hale', toc_name: 'Hale', abbreviated_name: 'Hale' },
  { speaker_id: 'HC2', full_name: 'Larry Halisky', toc_name: 'Halisky', abbreviated_name: 'Halisky' },
];
const test4Assignments = [];
const test4Ministering = [];
const test4Units = [];

const result4 = mapSpeakerSchedule(test4Speakers, test4Assignments, test4Ministering, test4Units);

assert.strictEqual(result4[0].id, 'HC1');
assert.strictEqual(result4[1].id, 'HC10');
assert.strictEqual(result4[2].id, 'HC2');

// Test 5: Empty rows are filtered out
const test5Speakers = [
  { speaker_id: 'HC1', full_name: 'Jon Hale', toc_name: 'Hale', abbreviated_name: 'Hale' },
  { speaker_id: '', full_name: '', toc_name: '', abbreviated_name: '' },
];
const test5Assignments = [
  { unit_id: 'ERS', speaker_id: 'HC1', date: '05/17/26', notes: '' },
  { unit_id: '', speaker_id: '', date: '', notes: '' },
];
const test5Ministering = [
  { interviewee: 'HC1', stake_presidency_member: 'Lee', datetime: '05/27/2026 08:30 PM', location: 'Durham Stake Center', note: '' },
  { interviewee: '', stake_presidency_member: '', datetime: '', location: '', note: '' },
];
const test5Units = [
  { unit_id: 'ERS', conference_date: '01/11/26', unit_name: 'Eno River Branch (Spanish)', unit_abbrev: 'Eno River' },
];

const result5 = mapSpeakerSchedule(test5Speakers, test5Assignments, test5Ministering, test5Units);

assert.strictEqual(result5.length, 1);
assert.strictEqual(result5[0].speakingAssignments.length, 1);
assert.strictEqual(result5[0].ministeringInterviews.length, 1);

// Test 6: Speaker with only speaking assignments (no ministering)
const test6Speakers = [
  { speaker_id: 'YM', full_name: 'Stake Young Men', toc_name: 'Stake Young Men', abbreviated_name: 'Stake Young Men' },
];
const test6Assignments = [
  { unit_id: 'ERS', speaker_id: 'YM', date: '01/18/26', notes: '' },
];
const test6Ministering = [];
const test6Units = [
  { unit_id: 'ERS', conference_date: '01/11/26', unit_name: 'Eno River Branch (Spanish)', unit_abbrev: 'Eno River' },
];

const result6 = mapSpeakerSchedule(test6Speakers, test6Assignments, test6Ministering, test6Units);

assert.strictEqual(result6.length, 1);
assert.strictEqual(result6[0].speakingAssignments.length, 1);
assert.strictEqual(result6[0].ministeringInterviews.length, 0);

// Test 7: Speaker with only ministering (no speaking assignments)
const test7Speakers = [
  { speaker_id: 'HC8', full_name: 'Greg Twiss', toc_name: 'Twiss', abbreviated_name: 'Twiss' },
];
const test7Assignments = [];
const test7Ministering = [
  { interviewee: 'HC8', stake_presidency_member: 'Dyreng', datetime: '01/14/2026 08:00 PM', location: 'Berini building', note: '' },
];
const test7Units = [];

const result7 = mapSpeakerSchedule(test7Speakers, test7Assignments, test7Ministering, test7Units);

assert.strictEqual(result7.length, 1);
assert.strictEqual(result7[0].speakingAssignments.length, 0);
assert.strictEqual(result7[0].ministeringInterviews.length, 1);
assert.strictEqual(result7[0].ministeringInterviews[0].dateTime, '01/14/2026 08:00 PM');
assert.strictEqual(result7[0].ministeringInterviews[0].location, 'Berini building');

// Test 8: Multiple assignments and ministering per speaker
const test8Speakers = [
  { speaker_id: 'RS', full_name: 'Stake Relief Society', toc_name: 'Stake Relief Society', abbreviated_name: 'Stake Relief Society' },
];
const test8Assignments = [
  { unit_id: 'ROX', speaker_id: 'RS', date: '05/17/26', notes: '' },
  { unit_id: 'D2', speaker_id: 'RS', date: '06/14/26', notes: 'Extra note' },
];
const test8Ministering = [
  { interviewee: 'RS', stake_presidency_member: 'Christensen', datetime: '01/28/2026 06:45 PM', location: 'Durham Stake Center', note: 'Entire Stake Relief Society Presidency' },
  { interviewee: 'RS', stake_presidency_member: 'Christensen', datetime: '02/25/2026 07:00 PM', location: 'Durham Stake Center', note: '' },
];
const test8Units = [
  { unit_id: 'ROX', conference_date: '04/26/26', unit_name: 'Roxboro Branch', unit_abbrev: 'Roxboro' },
  { unit_id: 'D2', conference_date: '03/15/26', unit_name: 'Durham 2nd Ward', unit_abbrev: 'Durham 2nd' },
];

const result8 = mapSpeakerSchedule(test8Speakers, test8Assignments, test8Ministering, test8Units);

assert.strictEqual(result8[0].speakingAssignments.length, 2);
assert.strictEqual(result8[0].speakingAssignments[0].unit, 'Roxboro');
assert.strictEqual(result8[0].speakingAssignments[1].unit, 'Durham 2nd');
assert.strictEqual(result8[0].speakingAssignments[1].note, 'Extra note');
assert.strictEqual(result8[0].ministeringInterviews.length, 2);
assert.strictEqual(result8[0].ministeringInterviews[0].note, 'Entire Stake Relief Society Presidency');

console.log('All tests passed');
