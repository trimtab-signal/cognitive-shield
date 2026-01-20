/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * PII Redaction Middleware (Simulated)
 * Scrubs text of common PII patterns.
 */

const piiPatterns = {
  email: /[\w.-]+@[\w.-]+\.\w+/g,
  phone: /(\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}/g,
  ssn: /\d{3}-\d{2}-\d{4}/g,
};

export function redactPII(text: string): string {
  let redactedText = text;
  redactedText = redactedText.replace(piiPatterns.email, '[EMAIL]');
  redactedText = redactedText.replace(piiPatterns.phone, '[PHONE]');
  redactedText = redactedText.replace(piiPatterns.ssn, '[SSN]');
  return redactedText;
}
