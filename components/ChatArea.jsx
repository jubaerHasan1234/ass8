import Suggestions from "./Suggestions";

const ChatArea = ({ onSendMessage }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto animate-slide-down-fade">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 mb-8 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 opacity-80"></div>
      </div>

      {/* Greeting */}
      <h1 className="text-4xl font-instrument font-semibold text-gray-800 mb-2">
        Hi there
      </h1>
      <h2 className="text-3xl font-instrument font-semibold text-gray-800 mb-6">
        How can I help you today?
      </h2>

      {/* Description */}
      <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
        I&apos;m a professional looking for an AI assistant that helps with
        their workflows, automates routine tasks, and gives valuable insights
        based on real-time data.
      </p>

      {/* Prompt Suggestions */}
      <Suggestions onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatArea;
