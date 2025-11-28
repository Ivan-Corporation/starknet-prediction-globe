import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useSendTransaction,
  useTransactionReceipt,
  useReadContract,
} from "@starknet-react/core";
import SimpleCounterAbiJson from "./abi/SimpleCounter.json";
// @ts-ignore
const SimpleCounterAbi = SimpleCounterAbiJson as const;

const CONTRACT_ADDRESS =
  "0x04e0501228e3679852adfd003b5faca84b3b2accaf376f16cd4cefaa8ba77743";

function App() {
  const { account, address } = useAccount();
  const { connect, connectors } = useConnect();

  const { data: countData, refetch } = useReadContract({
    // @ts-ignore
    abi: SimpleCounterAbi,
    address: CONTRACT_ADDRESS,
    functionName: "get_current_count",
    // @ts-ignore
    args: [],
  });

  console.log("countData", countData);

  const incrementTx = useSendTransaction({
    calls: [
      {
        contractAddress: CONTRACT_ADDRESS,
        entrypoint: "increment",
        calldata: [],
      },
    ],
  });

  const incrementReceipt = useTransactionReceipt({
    hash: incrementTx.data?.transaction_hash,
  });

  useEffect(() => {
    if (incrementReceipt.isSuccess) {
      setTimeout(() => {
         refetch();
      }, 3000);
     
    }
  }, [incrementReceipt.isSuccess]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAsk = () => {
    if (!question || isAnimating || incrementTx.isPending) return;

    setIsAnimating(true);
    setAnswer("");

    setTimeout(() => {
      const answers = [
        "It is certain.",
        "It is decidedly so.",
        "Without a doubt.",
        "Yes definitely.",
        "You may rely on it.",
        "As I see it, yes.",
        "Most likely.",
        "Outlook good.",
        "Yes.",
        "Signs point to yes.",
        "Reply hazy, try again.",
        "Ask again later.",
        "Better not tell you now.",
        "Cannot predict now.",
        "Concentrate and ask again.",
        "Don't count on it.",
        "My reply is no.",
        "My sources say no.",
        "Outlook not so good.",
        "Very doubtful.",
      ];
      const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
      setAnswer(randomAnswer);
      setIsAnimating(false);
      incrementTx.send();
    }, 2000); // Animate for 2 seconds
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-950 text-white py-8 px-0 relative overflow-hidden">
      {/* Mystical Runes Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="rune rune-1">ᚠ</div>
        <div className="rune rune-2">ᚢ</div>
        <div className="rune rune-3">ᚦ</div>
        <div className="rune rune-4">ᚨ</div>
        <div className="rune rune-5">ᚱ</div>
        <div className="rune rune-6">ᚲ</div>
        <div className="rune rune-7">ᚷ</div>
        <div className="rune rune-8">ᚹ</div>
        <div className="rune rune-9">ᚺ</div>
        <div className="rune rune-10">ᚾ</div>
      </div>

      {/* Subtle particles only in background - MOVED BEFORE RUNES */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 1 + 1}s`,
            }}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`magic-${i}`}
            className="magic-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      <h1 className="text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 relative z-10 tracking-wider">
        CRYSTAL BALL PROPHECIES
      </h1>

      {!account ? (
        <div className="mb-8 flex gap-4 relative z-10">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg border border-purple-500/30 transition-all duration-300 transform hover:scale-105"
            >
              Connect {connector.name}
            </button>
          ))}
        </div>
      ) : (
        <p className="mb-8 text-green-300 font-semibold relative z-10 bg-gray-800/50 px-4 py-2 rounded-lg border border-green-500/30">
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      )}

      {account && (
        <>
          <div className="relative w-96 h-96 perspective-3d z-10 mb-8">
            {/* Crystal Ball Container */}
            <div className="w-full h-full relative">
              {/* Outer Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl animate-pulse-slow"></div>
              
              {/* Main Crystal Ball */}
              <div className={`crystal-ball ${isAnimating ? 'animate-oracle' : ''}`}>
                {/* Inner Core Glow */}
                <div className="inner-core"></div>
                
                {/* Swirling Magic */}
                <div className="swirl swirl-1"></div>
                <div className="swirl swirl-2"></div>
                <div className="swirl swirl-3"></div>
                
                {/* Floating Particles Inside */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="inner-particle" style={{
                    animationDelay: `${i * 0.3}s`,
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                  }}></div>
                ))}
                
                {/* Answer Text */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className={`text-center px-8 text-white font-medium text-xl ${answer ? 'animate-text-glow' : ''} ${isAnimating ? 'text-shimmer' : ''}`}>
                    {isAnimating ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    ) : (
                      answer || "Ask your question..."
                    )}
                  </span>
                </div>
              </div>

        
            </div>
          </div>

          <div className="relative z-20 w-full max-w-lg mb-8"> {/* Increased z-index to 20 */}
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-800/90 border border-purple-500/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm relative z-20"
              placeholder="Ask your question to the ancient ones..."
              onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
            />
          </div>

          <button
            onClick={handleAsk}
            disabled={!question || isAnimating || incrementTx.isPending}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative z-20 border border-purple-400/30 transform hover:scale-105 font-semibold tracking-wide"
          >
            {incrementTx.isPending ? "Channeling Magic..." : "Consult the Oracle"}
          </button>

          <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-purple-500/30 relative z-10">
            <p className="text-xl text-center">
              Prophecies revealed: <span className="text-purple-300 font-bold">{countData ? Number(countData) : "Loading..."}</span>
            </p>
          </div>

          {/* <button
            onClick={() => refetch()}
            className="mt-4 bg-gray-700/80 hover:bg-gray-600/80 text-white px-6 py-2 rounded-lg border border-gray-500/30 transition-all duration-300 relative z-10"
          >
            Refresh Count
          </button> */}
        </>
      )}
    </div>
  );
}

export default App;