export default function Tab({ tabData, field, setField }) {
    return (
      <div className="flex bg-neutral-100 p-1 gap-x-1 my-6 rounded-full max-w-max border border-neutral-200">
        {tabData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setField(tab.type)}
            className={`${
              field === tab.type
                ? "bg-primary-600 text-white shadow-lg"
                : "bg-transparent text-neutral-600 hover:text-neutral-800"
            } py-2 px-5 rounded-full transition-all duration-200 font-medium`}
          >
            {tab?.tabName}
          </button>
        ))}
      </div>
    );
  }