import crypto from 'crypto';

export function hashIncidentSecret(secret: string) {
    return crypto
    .createHmac("sha256", process.env.INCIDENT_SECRET_PEPPER!)
    .update(secret)
    .digest("hex")
};