export default function StatCard({
                                     title,
                                     value,
                                     icon,
                                     color
                                 }) {

    return (
        <div className="
            bg-slate-900
            border
            border-slate-800
            rounded-3xl
            p-6
        ">

            <div className="flex justify-between">

                <div>

                    <p className="text-slate-400 text-sm">
                        {title}
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                        {value}
                    </h2>

                </div>

                <div
                    className={`
                    w-12
                    h-12
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    ${color}
                    `}
                >
                    {icon}
                </div>

            </div>

        </div>
    );
}