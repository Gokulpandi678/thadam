import {
  CLIENT_TYPES,
  ENGAGEMENT_TYPES,
  VALUE_TAGS,
  MEETING_TYPES_OPTIONS,
} from "../../../../shared/constants/contactOptions";

const contactDrawerTabs = [
  {
    label: "Personal",
    sections: [
      {
        fields: [
          { key: "firstName", label: "First name", required: true },
          { key: "lastName", label: "Last name" },
          { key: "primaryEmail", label: "Primary email", type: "email", span: "full" },
          { key: "secondaryEmail", label: "Secondary email", type: "email", span: "full" },
          { key: "primaryContactNo", label: "Primary phone", type: "tel" },
          { key: "secondaryContactNo", label: "Secondary phone", type: "tel" },
          { key: "referredBy", label: "Referred by", span: "full" },
          { key: "lastContactedDate", label: "Last contacted", type: "date", span: "full" },
        ],
      },
    ],
  },
  {
    label: "Work",
    sections: [
      {
        fields: [
          { key: "company", label: "Company", span: "full" },
          { key: "designation", label: "Designation", span: "full" },
          { key: "role", label: "Role", type: "roleselect", span: "full" },
        ],
      },
      {
        title: "Social profiles",
        columns: 1,
        fields: [
          { key: "socialLinkedin", label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/in/..." },
          { key: "socialTwitter", label: "Twitter", type: "url", placeholder: "https://x.com/..." },
          { key: "socialYoutube", label: "YouTube", type: "url", placeholder: "https://youtube.com/..." },
        ],
      },
    ],
  },
  {
    label: "Address",
    sections: [
      {
        columns: 1,
        fields: [
          { key: "addressStreet", label: "Street" },
          { key: "addressNumber", label: "Number" },
          { key: "addressCity", label: "City" },
          { key: "addressState", label: "State" },
          { key: "addressPostcode", label: "Postcode" },
          { key: "addressCountry", label: "Country" },
        ],
      },
    ],
  },
  {
    label: "Client",
    sections: [
      {
        title: "Relationship",
        fields: [
          { key: "clientType", label: "Client type", type: "select", options: CLIENT_TYPES },
          { key: "clientSince", label: "Client since", type: "date" },
          {
            key: "conversionReason",
            label: "How did they become a client?",
            span: "full",
            placeholder: "e.g. Offered a freelance web project",
          },
        ],
      },
      {
        title: "What do they bring?",
        fields: [
          { key: "valueTags", label: "", type: "tags", options: VALUE_TAGS },
        ],
      },
      {
        title: "Engagement",
        fields: [
          {
            key: "engagementType",
            label: "Engagement type",
            type: "select",
            options: ENGAGEMENT_TYPES,
          },
          { key: "nextFollowUp", label: "Next follow-up", type: "date" },
          {
            key: "notes",
            label: "Notes",
            type: "textarea",
            span: "full",
            placeholder: "Any context, terms, or notes...",
          },
        ],
      },
    ],
  },
  {
    label: "Meeting",
    sections: [
      {
        title: "Meeting log",
        subtitle: "Attach a log to this contact",
        fields: [
          {
            key: "meetingType",
            label: "Meeting type",
            type: "select",
            span: "full",
            options: MEETING_TYPES_OPTIONS,
          },
          { key: "meetingDate", label: "Date", type: "date", required: true },
          {
            key: "meetingDuration",
            label: "Duration",
            placeholder: "e.g. 1 hour, 30 min, 1 day",
            required: true,
          },
          {
            key: "meetingDescription",
            label: "Description",
            type: "textarea",
            span: "full",
            placeholder: "What happened in this meeting...",
          },
        ],
      },
    ],
  },
];

export default contactDrawerTabs;
