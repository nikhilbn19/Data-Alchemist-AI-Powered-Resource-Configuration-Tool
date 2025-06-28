type Props = {
  errors: string[];
};

export default function ValidationPanel({ errors }: Props) {
  return (
    <div className="bg-white shadow-md p-4 rounded-xl my-4">
      <h2 className="text-xl font-semibold mb-3">Validation Summary</h2>
      {errors.length === 1 && errors[0].includes("No validation errors") ? (
        <div className="text-green-600">{errors[0]}</div>
      ) : (
        <ul className="list-disc ml-6 text-red-600">
          {errors.map((error, index) => (
            <li key={index} className="mb-1">
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
