import Animation from "./Animation";

export default function MessageAnimation({ message }) {
  return (
    <div className="animate-slide-down-fade">
      <div className="px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-10 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            {/*  <h1 className="text-lg font-semibold text-gray-800">
              {conversationTitle}
            </h1> */}
            <Animation type="title" />
          </div>
          <div className="relative">
            <Animation type="dots" />
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col p-8 overflow-y-auto space-y-6">
        <div className="justify-end flex items-start space-x-3 ">
          <div className="flex-1 max-w-3xl">
            <div className="rounded-2xl px-4 py-3 bg-gray-100">
              <p className="text-gray-800">{message}</p>
            </div>
            <span className="text-xs text-gray-500 mt-1 block">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            H
          </div>
        </div>

        {/* Loading indicator when waiting for AI response */}
        {true && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              AI
            </div>
            <div className="bg-gray-100 rounded-lg p-4 max-w-3xl">
              <div className="flex space-x-2">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
