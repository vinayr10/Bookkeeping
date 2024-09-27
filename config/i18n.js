const i18next = require('i18next');
const i18nextHttpMiddleware = require('i18next-http-middleware');
const LanguageDetector = require('i18next-http-middleware').LanguageDetector;

i18next
    .use(LanguageDetector) // Use the language detector
    .init({
        fallbackLng: 'en', // Fallback language if no language is detected
        resources: {
            en: {
                translation: {
                    success: "Operation successful",
                    error: "An error occurred"
                }
            },
            hi: {
                translation: {
                    success: "ऑपरेशन सफल",
                    error: "एक त्रुटि हुई"
                }
            }
        }
    });

module.exports = {
    i18next,
    i18nextHttpMiddleware
};
