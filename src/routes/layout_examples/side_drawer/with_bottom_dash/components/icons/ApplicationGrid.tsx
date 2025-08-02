interface ApplicationGridIconProps {
  isActive?: boolean;
}

const ApplicationGridIcon = (props: ApplicationGridIconProps) => {
  return (
    <svg 
      class="w-5 h-5 text-white transition-transform duration-300 ease-out"
      classList={{
        "rotate-90": props.isActive,
      }}
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
    </svg>
  );
};

export default ApplicationGridIcon;
