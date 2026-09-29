import {useEffect, useState} from 'react'
import './App.css'

const ACCENTS = ['gold', 'teal', 'clay']

function App() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [releaseDate, setReleaseDate] = useState("")

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/games/");
            const data = await response.json()
            setGames(data);
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    };

    const clearForm = () => {
        setTitle("");
        setDescription("");
        setPrice("");
        setReleaseDate("");
    };

    const addGame = async () => {
        if (!title.trim()) return;
        const gameData = {
            title,
            description,
            price,
            release_date: releaseDate,
        };
        try {
            const response = await fetch("http://127.0.0.1:8000/api/games/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameData)
            });
            const data = await response.json()
            setGames((prev) => [...prev, data]);
            clearForm();
        }
        catch (err) {
            console.log(err)
        }
    };

    const startEdit = (game) => {
        setEditingId(game.id);
        setEditData((prev) => ({
            ...prev,
            [game.id]: {
                title: game.title,
                description: game.description,
                price: game.price,
                releaseDate: game.release_date,
            }
        }));
    };

    const editChange = (id, field, value) => {
        setEditData((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const updateGame = async (id) => {
        const changes = editData[id];

        if (!changes) return;

        const gameData = {};
        if (changes.title !== undefined ) gameData.title = changes.title;
        if (changes.description !== undefined ) gameData.description = changes.description;
        if (changes.price !== undefined ) gameData.price = changes.price;
        if (changes.releaseDate !== undefined ) gameData.release_date = changes.releaseDate;

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/games/${id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(gameData)
            });

            if (!response.ok) {
                throw new Error("Failed to update game");
            }

            const updatedGame = await response.json();

            setGames((prev) =>
                prev.map((game) => (game.id === id ? updatedGame : game))
            );
            setEditingId(null);
        }
        catch (err) {
            console.log(err);
        }
    };

    const deleteGame = async (pk) => {
         try {
             const response = await fetch(`http://127.0.0.1:8000/api/games/${pk}/`, {
                 method: "DELETE",
             });
             setGames((prev) => prev.filter((game) => game.id !== pk))
         }
         catch (err) {
             console.log(err)
         }
    };

    const formatPrice = (value) => {
        const n = Number(value);
        return Number.isFinite(n) ? `$${n.toFixed(2)}` : value;
    };

    return (
        <div className="page">
            <header className="page-header">
                <h1>Game store</h1>
            </header>

            <section className="add-bar">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="add-bar-description"
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <input
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                />
                <button className="btn-primary" onClick={addGame}>Add game</button>
            </section>

            {loading ? (
                <p className="status-text">Loading your catalog…</p>
            ) : games.length === 0 ? (
                <p className="status-text">No games yet — add your first one above.</p>
            ) : (
                <section className="game-grid">
                    {games.map((game, i) => {
                        const isEditing = editingId === game.id;
                        const accent = ACCENTS[i % ACCENTS.length];
                        const edit = editData[game.id] || {};

                        return (
                            <article className={`game-card accent-${accent}`} key={game.id}>
                                <div className="card-edge" />
                                <div className="card-body">
                                    {isEditing ? (
                                        <div className="edit-form">
                                            <input
                                                type="text"
                                                value={edit.title ?? ""}
                                                onChange={(e) => editChange(game.id, "title", e.target.value)}
                                            />
                                            <textarea
                                                rows={2}
                                                value={edit.description ?? ""}
                                                onChange={(e) => editChange(game.id, "description", e.target.value)}
                                            />
                                            <div className="edit-row">
                                                <input
                                                    type="number"
                                                    value={edit.price ?? ""}
                                                    onChange={(e) => editChange(game.id, "price", e.target.value)}
                                                />
                                                <input
                                                    type="date"
                                                    value={edit.releaseDate ?? ""}
                                                    onChange={(e) => editChange(game.id, "releaseDate", e.target.value)}
                                                />
                                            </div>
                                            <div className="card-actions">
                                                <button className="btn-primary" onClick={() => updateGame(game.id)}>Save</button>
                                                <button className="btn-text" onClick={() => setEditingId(null)}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h2>{game.title}</h2>
                                            <p className="description">{game.description}</p>
                                            <div className="card-footer">
                                                <span className="price-tag">{formatPrice(game.price)}</span>
                                                <span className="release-date">{game.release_date}</span>
                                            </div>
                                            <div className="card-actions">
                                                <button className="btn-text" onClick={() => startEdit(game)}>Edit</button>
                                                <button className="btn-text btn-danger" onClick={() => deleteGame(game.id)}>Delete</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </section>
            )}
        </div>
    );


}

export default App
