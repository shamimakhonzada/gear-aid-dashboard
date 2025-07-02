interface ComponentCardProps {
  title?: string;
  desc?: string;
  className?: string;
  children: React.ReactNode;
  button?: React.ReactNode; // optional button component
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  desc = "",
  className = "",
  children,
  button,
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className={`${title || button ? "px-6 py-4" : "px-0 py-0"}`}>
        {(title || button) && (
          <div className="flex items-center justify-between">
            {title && (
              <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                {title}
              </h3>
            )}
            {button && <div>{button}</div>}
          </div>
        )}

        {desc && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {desc}
          </p>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
