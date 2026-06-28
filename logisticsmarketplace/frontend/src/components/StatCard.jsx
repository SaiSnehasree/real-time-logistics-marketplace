export default function StatCard({ title, value }) {
    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">
                {title}
            </p>

            <h2 className="text-4xl font-bold mt-3">
                {value}
            </h2>
        </div>
    );
}