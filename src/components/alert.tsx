export default function Alert({ message, success }: { message: string | undefined; success: boolean }) {
  return (
    message && (
      <div className={`alert ${success ? 'alert-success' : 'alert-danger'} mt-3`}>
        {message}
      </div>
    )
  );
}