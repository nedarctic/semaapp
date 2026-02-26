import { IconType } from "react-icons";

export type NavItem = {
    label: string;
    href: string;
    Logo: IconType;
}

export type IncidentStatus = "New" | "In Review" | "Investigation" | "Resolved" | "Closed" ;
export type ReporterType = "anonymous" | "confidential";

export type Incident = {
    id: number;
    company_id: number;
    incident_id_display: string;

    // core
    category: string;
    description: string;
    location: string;
    involved_people: string;
    incident_date: string;

    // reporter
    reporter_type: ReporterType;
    reporter_name?: string | null;
    reporter_email?: string | null;
    reporter_phone?: string | null;

    // workflow
    status: IncidentStatus;
    assigned_handler_user_id: number | null;

    // SLA 
    deadline_at: string | null;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
}

export type User = {
    id: number;
    company_id: number;
    name: string;
    email: string;
    role: "admin" | "handler";
    status: "active" | "inactive";
    created_at: string;
}

export interface Company {
    id: number;
    name: string;
    reporting_link_slug: string;
    created_at: string;
}

export type SecretCode = {
    incident_id: number;
    secret_code_hash: string;
    created_at: string;
}

export type Attachment = {
    id: number;
    incident_id: number;
    uploaded_by: "reporter" | "handler";
    file_name: string;
    file_path: string;
    created_at: string;
}

export type Message = {
    id: number;
    incident_id: number;
    sender_type: "reporter" | "handler";
    message_body: string;
    created_at: string;
}

export type AuditLog = {
    id: number;
    incident_id: number;
    actor_user_id: number;
    action_type: "assign_handler" | "status_change";
    metadata_json?: AuditLogMetadataJSON,
    created_at: string;
}

export type AuditLogMetadataJSON = {
    handler_id?: number,
    from?: IncidentStatus,
    to?: IncidentStatus,
}

export interface ReportingPageConfig {
    company_id: number;
    title: string;
    intro_content_html: string;
    policy_url: string;
    updated_at: string;
}

export type TrendPoint = {
  period: string;
  created: number;
  closed: number;
};

export type IncidentsPerCategory = {
    category: string;
    total_category_incidents: number;
    total_category_closed_incidents: number;
}

export type HandlerTeamStats = {
  handler_id: number;
  name: string;
  email: string;
  total_assigned_incidents: number;
  total_open_incidents: number;
  total_overdue_incidents: number;
  avg_resolution_time_days: number | null;
};