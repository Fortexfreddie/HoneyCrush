import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { client } from "../../lib/honeycombClient";
import { Plus } from "lucide-react";

const FetchCharacterButton = () => {
    const wallet = useWallet();
    const [loading, setLoading] = useState(false);
    const [characters, setCharacters] = useState<any[]>([]);
    
    
    const handleFetchCharacters = async () => {
        if (!wallet.publicKey) {
            alert("Connect your wallet first");
            return;
        }
        setLoading(true);
        try {
            // Fetch characters owned by the connected wallet
            const result = await client.findCharacters({
                wallets: [wallet.publicKey.toString()],
                includeProof: true,
            });

            console.log(result);
            setCharacters(result.character || []);
            alert(`Found ${result.character} character(s)!`);
        } catch (err) {
            alert("Failed to fetch characters");
            console.error(err);
        console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div>
            <button
                onClick={handleFetchCharacters}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-[#D4AA7D] hover:bg-[#EFD09E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer mb-4"
            >
                <Plus className="w-4 h-4" />
                {loading ? "Fetching..." : "Fetch Characters"}
            </button>

            {characters.length > 0 && (
                <div className="grid gap-4">
                    {characters.map((character) => {
                        const params = character.source?.params || {};
                        const uri = params.uri;
                        const attributes = params.attributes;
                        return (
                            <div key={character.address} className="character-card p-4 border rounded-xl bg-white/80 dark:bg-black/30">
                                {uri && <img src={uri} alt="Character" className="w-32 h-32 object-contain mb-2" />}
                                <p><strong>Owner:</strong> {character.owner}</p>
                                <p><strong>Address:</strong> {character.address}</p>
                                {attributes && (
                                    <ul className="mt-2">
                                        {Object.entries(attributes).map(([key, value]) => (
                                            <li key={key}><strong>{key}:</strong> {String(value)}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
 
export default FetchCharacterButton;