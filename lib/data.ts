import type { Incident, User, Company, SecretCode, Attachment, Message, AuditLog, ReportingPageConfig } from "@/lib/types";

export const company: Company = {
    "id": 1,
    "name": "Acme Industries Ltd",
    "reporting_link_slug": "acme-report",
    "created_at": "2026-01-10T09:00:00Z"
};

export const users: User[] = [
    {
        "id": 1,
        "company_id": 1,
        "name": "Grace Mwangi",
        "email": "grace@acme.com",
        "role": "admin",
        "status": "active",
        "created_at": "2026-01-10T09:10:00Z"
    },
    {
        "id": 2,
        "company_id": 1,
        "name": "Daniel Otieno",
        "email": "daniel@acme.com",
        "role": "handler",
        "status": "active",
        "created_at": "2026-01-12T11:30:00Z"
    },
    {
        "id": 3,
        "company_id": 1,
        "name": "Amina Hassan",
        "email": "amina@acme.com",
        "role": "handler",
        "status": "active",
        "created_at": "2026-01-15T08:45:00Z"
    }
];

export const incidents: Incident[] = [
    {
        "id": 101,
        "company_id": 1,
        "incident_id_display": "INC-000101",
        "category": "Corruption",
        "description": "Senior staff requested unofficial payments to approve vendor contracts.",
        "location": "Head Office – Procurement Department",
        "involved_people": "Procurement Manager, External Vendor",
        "incident_date": "2026-01-05",
        "reporter_type": "anonymous",
        "status": "Investigation",
        "assigned_handler_user_id": 2,
        "deadline_at": "2026-02-01T23:59:59Z",
        "created_at": "2026-01-06T10:15:00Z",
        "updated_at": "2026-02-05T14:20:00Z",
        "closed_at": null,
    },
    {
        "id": 102,
        "company_id": 1,
        "incident_id_display": "INC-000102",
        "category": "Discrimination",
        "description": "Repeated unfair treatment based on gender during promotion reviews.",
        "location": "Sales Department",
        "involved_people": "Sales Team Lead",
        "incident_date": "2026-01-18",
        "reporter_type": "confidential",
        "reporter_name": "Jane Doe",
        "reporter_email": "jane.doe@email.com",
        "reporter_phone": "+254700000000",
        "status": "In Review",
        "assigned_handler_user_id": 3,
        "deadline_at": "2026-02-12T23:59:59Z",
        "created_at": "2026-01-20T09:40:00Z",
        "updated_at": "2026-02-08T10:05:00Z",
        "closed_at": null,
    },
    {
        "id": 103,
        "company_id": 1,
        "incident_id_display": "INC-000103",
        "category": "Bribery",
        "description": "Cash bribe requested during site inspection approval.",
        "location": "Regional Office – Eldoret",
        "involved_people": "Site Inspector",
        "incident_date": "2025-12-15",
        "reporter_type": "anonymous",
        "status": "Resolved",
        "assigned_handler_user_id": 2,
        "deadline_at": "2026-01-15T23:59:59Z",
        "created_at": "2025-12-16T14:10:00Z",
        "updated_at": "2026-01-10T16:30:00Z",
        "closed_at": "2026-01-15T23:59:59Z",
    },
    {
        "id": 104,
        "company_id": 1,
        "incident_id_display": "INC-000104",
        "category": "Corruption",
        "description": "Senior staff requested unofficial payments to approve vendor contracts.",
        "location": "Head Office – Procurement Department",
        "involved_people": "Procurement Manager, External Vendor",
        "incident_date": "2026-01-05",
        "reporter_type": "anonymous",
        "status": "Investigation",
        "assigned_handler_user_id": 2,
        "deadline_at": "2026-02-01T23:59:59Z",
        "created_at": "2026-01-06T10:15:00Z",
        "updated_at": "2026-02-05T14:20:00Z",
        "closed_at": null,
    },
    {
        "id": 105,
        "company_id": 1,
        "incident_id_display": "INC-000105",
        "category": "Corruption",
        "description": "Senior staff requested unofficial payments to approve vendor contracts.",
        "location": "Head Office – Procurement Department",
        "involved_people": "Procurement Manager, External Vendor",
        "incident_date": "2026-01-05",
        "reporter_type": "anonymous",
        "status": "Investigation",
        "assigned_handler_user_id": 2,
        "deadline_at": "2026-02-01T23:59:59Z",
        "created_at": "2026-01-06T10:15:00Z",
        "updated_at": "2026-02-05T14:20:00Z",
        "closed_at": null,
    },
    {
        "id": 106,
        "company_id": 1,
        "incident_id_display": "INC-000106",
        "category": "Sexual abuse",
        "description": "Senior male staff requested inappropriate pictures from a junior staff to consider her for a company promotion.",
        "location": "Head Office – Procurement Department",
        "involved_people": "Procurement Manager, External Vendor",
        "incident_date": "2026-01-05",
        "reporter_type": "anonymous",
        "status": "Investigation",
        "assigned_handler_user_id": 2,
        "deadline_at": "2026-02-01T23:59:59Z",
        "created_at": "2026-01-06T10:15:00Z",
        "updated_at": "2026-02-05T14:20:00Z",
        "closed_at": null,
    },
    {
        "id": 107,
        "company_id": 1,
        "incident_id_display": "INC-000107",
        "category": "Corruption",
        "description": "Senior staff requested unofficial payments to approve vendor contracts.",
        "location": "Head Office – Procurement Department",
        "involved_people": "Procurement Manager, External Vendor",
        "incident_date": "2026-01-05",
        "reporter_type": "anonymous",
        "status": "Investigation",
        "assigned_handler_user_id": 2,
        "deadline_at": "2026-02-01T23:59:59Z",
        "created_at": "2026-01-06T10:15:00Z",
        "updated_at": "2026-02-05T14:20:00Z",
        "closed_at": null,
    },
    {
        "id": 108,
        "company_id": 1,
        "incident_id_display": "INC-000108",
        "category": "Verbal assault",
        "description": "Male staff verbally assaulted secretary",
        "location": "Head Office – Procurement Department",
        "involved_people": "Procurement Manager, External Vendor",
        "incident_date": "2026-01-05",
        "reporter_type": "anonymous",
        "status": "Investigation",
        "assigned_handler_user_id": null,
        "deadline_at": "2026-02-01T23:59:59Z",
        "created_at": "2026-01-06T10:15:00Z",
        "updated_at": "2026-02-05T14:20:00Z",
        "closed_at": null,
    },
];

export const secret_codes: SecretCode[] = [
    {
        "incident_id": 101,
        "secret_code_hash": "$2b$12$Kj9f...hashedvalue",
        "created_at": "2026-01-06T10:15:01Z"
    },
    {
        "incident_id": 102,
        "secret_code_hash": "$2b$12$Zx8p...hashedvalue",
        "created_at": "2026-01-20T09:40:01Z"
    }
];

export const attachments: Attachment[] = [
    {
        "id": 201,
        "incident_id": 101,
        "uploaded_by": "reporter",
        "file_name": "payment_request_email.pdf",
        "file_path": "incidents/101/payment_request_email.pdf",
        "created_at": "2026-01-06T10:18:00Z"
    },
    {
        "id": 202,
        "incident_id": 102,
        "uploaded_by": "handler",
        "file_name": "review_notes.docx",
        "file_path": "incidents/102/review_notes.docx",
        "created_at": "2026-02-01T12:00:00Z"
    }
];

export const messages: Message[] = [
    {
        "id": 301,
        "incident_id": 101,
        "sender_type": "reporter",
        "message_body": "I can provide more emails if required.",
        "created_at": "2026-01-08T09:00:00Z"
    },
    {
        "id": 302,
        "incident_id": 101,
        "sender_type": "handler",
        "message_body": "Thank you. Please upload any additional evidence.",
        "created_at": "2026-01-08T14:30:00Z"
    }
];

export const audit_log: AuditLog[] = [
    {
        "id": 401,
        "incident_id": 101,
        "actor_user_id": 1,
        "action_type": "assign_handler",
        "metadata_json": {
            "handler_id": 2
        },
        "created_at": "2026-01-06T11:00:00Z"
    },
    {
        "id": 402,
        "incident_id": 101,
        "actor_user_id": 2,
        "action_type": "status_change",
        "metadata_json": {
            "from": "In Review",
            "to": "Investigation"
        },
        "created_at": "2026-01-10T09:20:00Z"
    }
];

export const reporting_page_config: ReportingPageConfig = {
    "company_id": 1,
    "title": "Report a Concern Confidentially",
    "intro_content_html": "<p>You can safely report misconduct here. Anonymous reporting is supported.</p>",
    "policy_url": "https://acme.com/whistleblowing-policy",
    // categories:  ["corruption", "sexual assault", "verbal assault"],
    "updated_at": "2026-01-10T09:30:00Z"
}