import assert from 'node:assert';
import { mapUnitSchedule } from './unit-schedule.js';

// Helper: shared providing speakers data (full 12-month schedule)
const ALL_PROVIDING = [
  { month: 'January', unit_id: 'MEB' },
  { month: 'February', unit_id: 'D2' },
  { month: 'March', unit_id: 'D1' },
  { month: 'April', unit_id: 'DYSA' },
  { month: 'May', unit_id: 'HB' },
  { month: 'June', unit_id: 'UMS' },
  { month: 'July', unit_id: 'CH1' },
  { month: 'August', unit_id: 'MEB' },
  { month: 'September', unit_id: 'D2' },
  { month: 'October', unit_id: 'D1' },
  { month: 'November', unit_id: 'DYSA' },
  { month: 'December', unit_id: 'HB' },
];

// Helper: shared speakers data
const ALL_SPEAKERS = [
  { speaker_id: 'HC1', full_name: 'Jon Hale', toc_name: 'Hale', abbreviated_name: 'Hale' },
  { speaker_id: 'HC2', full_name: 'Larry Halisky', toc_name: 'Halisky', abbreviated_name: 'Halisky' },
  { speaker_id: 'HC3', full_name: 'Bill Michael', toc_name: 'Michael', abbreviated_name: 'Michael' },
  { speaker_id: 'HC4', full_name: 'Ben Milton', toc_name: 'Milton', abbreviated_name: 'Milton' },
  { speaker_id: 'HC5', full_name: 'Noah Oswald', toc_name: 'Oswald', abbreviated_name: 'Oswald' },
  { speaker_id: 'HC6', full_name: 'Jonathan Isgett', toc_name: 'Isgett', abbreviated_name: 'Isgett' },
  { speaker_id: 'HC7', full_name: 'Troy Tagg', toc_name: 'Tagg', abbreviated_name: 'Tagg' },
  { speaker_id: 'HC8', full_name: 'Greg Twiss', toc_name: 'Twiss', abbreviated_name: 'Twiss' },
  { speaker_id: 'HC9', full_name: 'Andrew Weaver', toc_name: 'Weaver', abbreviated_name: 'Weaver' },
  { speaker_id: 'HC10', full_name: 'Peter Gayek', toc_name: 'Gayek', abbreviated_name: 'Gayek' },
  { speaker_id: 'YM', full_name: 'Stake Young Men', toc_name: 'Stake Young Men', abbreviated_name: 'Stake Young Men' },
  { speaker_id: 'YW', full_name: 'Stake Young Women', toc_name: 'Stake Young Women', abbreviated_name: 'Stake Young Women' },
  { speaker_id: 'RS', full_name: 'Stake Relief Society', toc_name: 'Stake Relief Society', abbreviated_name: 'Stake Relief Society' },
  { speaker_id: 'SS', full_name: 'Stake Sunday School', toc_name: 'Stake Sunday School', abbreviated_name: 'Stake Sunday School' },
  { speaker_id: 'PRI', full_name: 'Stake Primary', toc_name: 'Stake Primary', abbreviated_name: 'Stake Primary' },
  { speaker_id: 'SSP', full_name: 'Grant Schmid', toc_name: 'Stake Sunday School', abbreviated_name: 'Schmid' },
  { speaker_id: 'YMP', full_name: 'Sean Zeller', toc_name: 'Stake Young Men', abbreviated_name: 'Zeller' },
];

// Test 1: Basic unit mapping (id, name, conferenceDate)
const test1Units = [
  { unit_id: 'ERS', conference_date: '01/11/26', unit_name: 'Eno River Branch (Spanish)', unit_abbrev: 'Eno River' },
];
const test1Result = mapUnitSchedule(test1Units, ALL_SPEAKERS, [], [], ALL_PROVIDING, []);
assert.strictEqual(test1Result.length, 1);
assert.strictEqual(test1Result[0].id, 'ERS');
assert.strictEqual(test1Result[0].name, 'Eno River Branch (Spanish)');
assert.strictEqual(test1Result[0].conferenceDate, '01/11/26');
assert.deepStrictEqual(test1Result[0].eqpMeetings, []);
assert.deepStrictEqual(test1Result[0].leaderMeetings, []);
assert.strictEqual(test1Result[0].leaderType, null);
assert.deepStrictEqual(test1Result[0].stakeCouncilSpeakers, []);
assert.deepStrictEqual(test1Result[0].stakePresidencySpeakers, []);
assert.strictEqual(test1Result[0].receivingSpeakers.length, 12);
assert.strictEqual(test1Result[0].receivingSpeakers[0].name, 'MEB');
assert.strictEqual(test1Result[0].receivingSpeakers[0].date, '1/1/2026');
assert.strictEqual(test1Result[0].receivingSpeakers[11].name, 'HB');
assert.strictEqual(test1Result[0].receivingSpeakers[11].date, '12/1/2026');
assert.strictEqual(test1Result[0].providingSpeakers, undefined);

// Test 2: eqpMeetings and leaderMeetings filtering from ministering data
const test2Ministering = [
  { stake_presidency_member: 'Christensen', date_time: '05/13/26 07:00 PM', interviewee: 'EQP', interviewee_name: 'Elders Quorum President', unit_id: 'ERS', location: 'Durham Stake Center' },
  { stake_presidency_member: 'Lee', date_time: '09/27/26 01:00 PM', interviewee: 'EQP', interviewee_name: 'Elders Quorum President', unit_id: 'ERS', location: 'Berini building' },
  { stake_presidency_member: 'Christensen', date_time: '05/24/26 01:00 PM', interviewee: 'BP', interviewee_name: 'Branch President', unit_id: 'ERS', location: 'Berini building' },
  { stake_presidency_member: 'Dyreng', date_time: '09/09/26 08:30 PM', interviewee: 'BP', interviewee_name: 'Branch President', unit_id: 'ERS', location: 'Berini building' },
];
const test2Units = [
  { unit_id: 'ERS', conference_date: '01/11/26', unit_name: 'Eno River Branch (Spanish)', unit_abbrev: 'Eno River' },
];
const test2Result = mapUnitSchedule(test2Units, ALL_SPEAKERS, [], [], ALL_PROVIDING, test2Ministering);
assert.strictEqual(test2Result[0].eqpMeetings.length, 2);
assert.strictEqual(test2Result[0].eqpMeetings[0].date, '05/13/26 07:00 PM');
assert.strictEqual(test2Result[0].eqpMeetings[0].location, 'Durham Stake Center');
assert.strictEqual(test2Result[0].eqpMeetings[0].member, 'Christensen');
assert.strictEqual(test2Result[0].eqpMeetings[1].date, '09/27/26 01:00 PM');
assert.strictEqual(test2Result[0].eqpMeetings[1].location, 'Berini building');
assert.strictEqual(test2Result[0].eqpMeetings[1].member, 'Lee');
assert.strictEqual(test2Result[0].leaderMeetings.length, 2);
assert.strictEqual(test2Result[0].leaderMeetings[0].date, '05/24/26 01:00 PM');
assert.strictEqual(test2Result[0].leaderMeetings[0].location, 'Berini building');
assert.strictEqual(test2Result[0].leaderMeetings[0].member, 'Christensen');
assert.strictEqual(test2Result[0].leaderMeetings[1].date, '09/09/26 08:30 PM');
assert.strictEqual(test2Result[0].leaderMeetings[1].location, 'Berini building');
assert.strictEqual(test2Result[0].leaderMeetings[1].member, 'Dyreng');
assert.strictEqual(test2Result[0].leaderType, 'Branch President');

// Test 3: leaderType for Bishop (not BP)
const test3Ministering = [
  { stake_presidency_member: 'Lee', date_time: '05/24/26 11:00 AM', interviewee: 'Bishop', interviewee_name: 'Bishop', unit_id: 'MEB', location: 'Mebane building' },
  { stake_presidency_member: 'Dyreng', date_time: '05/24/26 12:30 PM', interviewee: 'Bishop', interviewee_name: 'Bishop', unit_id: 'MEB', location: 'Durham Stake Center' },
];
const test3Units = [
  { unit_id: 'MEB', conference_date: '04/19/26', unit_name: 'Mebane Ward', unit_abbrev: 'Mebane' },
];
const test3Result = mapUnitSchedule(test3Units, ALL_SPEAKERS, [], [], ALL_PROVIDING, test3Ministering);
assert.strictEqual(test3Result[0].leaderType, 'Bishop');

// Test 4: stakeCouncilSpeakers with speaker name resolution
const test4Assignments = [
  { unit_id: 'ERS', speaker_id: 'YM', date: '01/18/26', notes: '' },
  { unit_id: 'ERS', speaker_id: 'HC1', date: '05/17/26', notes: '' },
  { unit_id: 'ERS', speaker_id: 'SSP', date: '03/15/26', notes: '' },
];
const test4Units = [
  { unit_id: 'ERS', conference_date: '01/11/26', unit_name: 'Eno River Branch (Spanish)', unit_abbrev: 'Eno River' },
];
const test4Result = mapUnitSchedule(test4Units, ALL_SPEAKERS, test4Assignments, [], ALL_PROVIDING, []);
assert.strictEqual(test4Result[0].stakeCouncilSpeakers.length, 3);
assert.strictEqual(test4Result[0].stakeCouncilSpeakers[0].name, 'YM');
assert.strictEqual(test4Result[0].stakeCouncilSpeakers[0].date, '01/18/26');
assert.strictEqual(test4Result[0].stakeCouncilSpeakers[1].name, 'Schmid');
assert.strictEqual(test4Result[0].stakeCouncilSpeakers[1].date, '03/15/26');
assert.strictEqual(test4Result[0].stakeCouncilSpeakers[2].name, 'Hale');
assert.strictEqual(test4Result[0].stakeCouncilSpeakers[2].date, '05/17/26');

// Test 5: stakePresidencySpeakers with month-to-date conversion
const test5Presidency = [
  { unit_id: 'ERS', month: 'January', stake_presidency_member: 'Christensen' },
  { unit_id: 'ERS', month: 'September', stake_presidency_member: 'Lee' },
];
const test5Units = [
  { unit_id: 'ERS', conference_date: '01/11/26', unit_name: 'Eno River Branch (Spanish)', unit_abbrev: 'Eno River' },
];
const test5Result = mapUnitSchedule(test5Units, ALL_SPEAKERS, [], test5Presidency, ALL_PROVIDING, []);
assert.strictEqual(test5Result[0].stakePresidencySpeakers.length, 2);
assert.strictEqual(test5Result[0].stakePresidencySpeakers[0].name, 'Christensen');
assert.strictEqual(test5Result[0].stakePresidencySpeakers[0].date, '1/1/2026');
assert.strictEqual(test5Result[0].stakePresidencySpeakers[1].name, 'Lee');
assert.strictEqual(test5Result[0].stakePresidencySpeakers[1].date, '9/1/2026');

// Test 6: receivingSpeakers on ERS and ROX only
const test6Units = [
  { unit_id: 'ERS', conference_date: '01/11/26', unit_name: 'Eno River Branch (Spanish)', unit_abbrev: 'Eno River' },
  { unit_id: 'ROX', conference_date: '04/26/26', unit_name: 'Roxboro Branch', unit_abbrev: 'Roxboro' },
  { unit_id: 'UMS', conference_date: '01/18/26', unit_name: 'University Ward', unit_abbrev: 'University' },
];
const test6Result = mapUnitSchedule(test6Units, ALL_SPEAKERS, [], [], ALL_PROVIDING, []);
assert.ok(test6Result[0].receivingSpeakers, 'ERS should have receivingSpeakers');
assert.strictEqual(test6Result[0].receivingSpeakers.length, 12);
assert.strictEqual(test6Result[0].receivingSpeakers[0].name, 'MEB');
assert.strictEqual(test6Result[0].receivingSpeakers[0].date, '1/1/2026');
assert.strictEqual(test6Result[0].receivingSpeakers[11].name, 'HB');
assert.strictEqual(test6Result[0].receivingSpeakers[11].date, '12/1/2026');
assert.ok(test6Result[1].receivingSpeakers, 'ROX should have receivingSpeakers');
assert.strictEqual(test6Result[1].receivingSpeakers.length, 12);
assert.strictEqual(test6Result[2].receivingSpeakers, undefined, 'UMS should NOT have receivingSpeakers');

// Test 7: providingSpeakers on all units except FSLG
const test7Presidency = [
  { unit_id: 'UMS', month: 'January', stake_presidency_member: 'Lee' },
  { unit_id: 'UMS', month: 'September', stake_presidency_member: 'Christensen' },
  { unit_id: 'FSLG', month: '', stake_presidency_member: '' },
];
const test7Units = [
  { unit_id: 'UMS', conference_date: '01/18/26', unit_name: 'University Ward', unit_abbrev: 'University' },
  { unit_id: 'FSLG', conference_date: '', unit_name: 'French Sango Language Group', unit_abbrev: 'French Sango Language Group' },
];
const test7Result = mapUnitSchedule(test7Units, ALL_SPEAKERS, [], test7Presidency, ALL_PROVIDING, []);
// After sort: test7Result[0] = FSLG, test7Result[1] = UMS
assert.strictEqual(test7Result[0].providingSpeakers, undefined, 'FSLG should NOT have providingSpeakers');
assert.strictEqual(test7Result[1].providingSpeakers.length, 2);
assert.strictEqual(test7Result[1].providingSpeakers[0].name, 'ERS, ROX');
assert.strictEqual(test7Result[1].providingSpeakers[0].date, '1/1/2026');
assert.strictEqual(test7Result[1].providingSpeakers[1].name, 'ERS, ROX');
assert.strictEqual(test7Result[1].providingSpeakers[1].date, '9/1/2026');

// Test 8: FSLG edge case — no ministering data, leaderType null
const test8Units = [
  { unit_id: 'FSLG', conference_date: '', unit_name: 'French Sango Language Group', unit_abbrev: 'French Sango Language Group' },
];
const test8Result = mapUnitSchedule(test8Units, ALL_SPEAKERS, [], [], ALL_PROVIDING, []);
assert.strictEqual(test8Result[0].id, 'FSLG');
assert.strictEqual(test8Result[0].eqpMeetings.length, 0);
assert.strictEqual(test8Result[0].leaderMeetings.length, 0);
assert.strictEqual(test8Result[0].leaderType, null);
assert.strictEqual(test8Result[0].receivingSpeakers, undefined);
assert.strictEqual(test8Result[0].providingSpeakers, undefined);

// Test 9: Sort order is lexicographic by id
const test9Units = [
  { unit_id: 'ROX', conference_date: '04/26/26', unit_name: 'Roxboro Branch', unit_abbrev: 'Roxboro' },
  { unit_id: 'ERS', conference_date: '01/11/26', unit_name: 'Eno River Branch (Spanish)', unit_abbrev: 'Eno River' },
  { unit_id: 'D1', conference_date: '02/08/26', unit_name: 'Durham 1st Ward', unit_abbrev: 'Durham 1st' },
];
const test9Result = mapUnitSchedule(test9Units, ALL_SPEAKERS, [], [], ALL_PROVIDING, []);
assert.strictEqual(test9Result[0].id, 'D1');
assert.strictEqual(test9Result[1].id, 'ERS');
assert.strictEqual(test9Result[2].id, 'ROX');

// Test 10: Empty rows are filtered out
const test10Units = [
  { unit_id: 'ERS', conference_date: '01/11/26', unit_name: 'Eno River Branch (Spanish)', unit_abbrev: 'Eno River' },
  { unit_id: '', conference_date: '', unit_name: '', unit_abbrev: '' },
];
const test10Result = mapUnitSchedule(test10Units, ALL_SPEAKERS, [], [], ALL_PROVIDING, []);
assert.strictEqual(test10Result.length, 1);
assert.strictEqual(test10Result[0].id, 'ERS');

console.log('All tests passed');
