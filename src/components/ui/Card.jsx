const Card = ({ children, className, ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;