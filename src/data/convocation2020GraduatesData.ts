import { Alumni } from '../types/alumni';
import { RAW_2020_GRADUATES } from './rawGraduates2020';
import { map2020GraduateToAlumni } from '../utils/graduates2020Migration';

/**
 * Official Conferred Roster of the Breakthrough International Bible University
 * Global Convocation Ceremony on Friday, 4th December, 2020.
 *
 * Encompasses 669 conferred graduates spanning Kenya, Tanzania, Zimbabwe, Ethiopia, and Haiti:
 * - 33 Honorary Doctorate Recipients
 * - 13 Doctor of Philosophy (Ph.D.) in Biblical Counseling Psychology
 * - 61 Master's Degree Graduates
 * - 198 Bachelor's Degree Graduates
 * - 195 Diploma & Higher Diploma Recipients
 * - 169 Certificate & Introduction to Theological Studies Graduates
 */
export const CONVOCATION_2020_GRADUATES: Alumni[] = RAW_2020_GRADUATES.map((raw, idx) =>
  map2020GraduateToAlumni(raw, idx)
);
