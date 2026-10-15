import { useEffect, useRef, useState } from "react";
import { Download, FileText, HardDrive, Search, Trash2, UploadCloud } from "lucide-react";
import documentApi from "../api/documentApi";
import "./Documents.css";

const allowedExtensions = ["pdf", "xlsx", "xls", "doc", "docx", "jpg", "jpeg"];

function formatSize(bytes = 0) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getErrorMessage(error) {
    return error?.response?.data?.detail || error?.response?.data?.message || error?.message || "Something went wrong.";
}

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [busyId, setBusyId] = useState(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const fileInputRef = useRef(null);

    async function loadDocuments() {
        setLoading(true);
        try {
            const response = await documentApi.getAll();
            setDocuments(Array.isArray(response.data) ? response.data : []);
            setError("");
        } catch (loadError) {
            setError(getErrorMessage(loadError));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDocuments();
    }, []);

    async function handleFileChange(event) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        const extension = file.name.split(".").pop()?.toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            setError("Only PDF, Excel, Word, and JPG files are supported.");
            setNotice("");
            return;
        }

        setUploading(true);
        setError("");
        setNotice("");
        try {
            await documentApi.upload(file);
            setNotice(`${file.name} uploaded successfully.`);
            await loadDocuments();
        } catch (uploadError) {
            setError(getErrorMessage(uploadError));
        } finally {
            setUploading(false);
        }
    }

    async function handleDownload(document) {
        setBusyId(document.id);
        setError("");
        try {
            const response = await documentApi.download(document.objectKey);
            const url = URL.createObjectURL(response.data);
            const link = window.document.createElement("a");
            link.href = url;
            link.download = document.name || "document";
            link.click();
            URL.revokeObjectURL(url);
        } catch (downloadError) {
            setError(getErrorMessage(downloadError));
        } finally {
            setBusyId(null);
        }
    }

    async function handleDelete(document) {
        if (!window.confirm(`Delete “${document.name}”?`)) return;
        setBusyId(document.id);
        setError("");
        setNotice("");
        try {
            await documentApi.delete(document.id);
            setDocuments((current) => current.filter((item) => item.id !== document.id));
            setNotice(`${document.name} deleted.`);
        } catch (deleteError) {
            setError(getErrorMessage(deleteError));
        } finally {
            setBusyId(null);
        }
    }

    const visibleDocuments = documents.filter((document) =>
        document.name?.toLowerCase().includes(search.trim().toLowerCase())
    );
    const totalBytes = documents.reduce((total, document) => total + (Number(document.size) || 0), 0);

    return (
        <div className="documents-page">
            <header className="documents-header">
                <div>
                    <p className="documents-eyebrow">WORKSPACE</p>
                    <h1>Documents</h1>
                    <p className="documents-subtitle">Store and manage school files in one place.</p>
                </div>
                <button className="documents-upload-button" type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    <UploadCloud size={17} />
                    {uploading ? "Uploading…" : "Upload document"}
                </button>
                <input
                    ref={fileInputRef}
                    className="documents-file-input"
                    type="file"
                    accept=".pdf,.xlsx,.xls,.doc,.docx,.jpg,.jpeg"
                    onChange={handleFileChange}
                    aria-label="Choose a document to upload"
                />
            </header>

            <section className="documents-overview" aria-label="Document storage summary">
                <div className="documents-overview-icon"><HardDrive size={21} /></div>
                <div><span>Stored documents</span><strong>{documents.length}</strong></div>
                <div className="documents-overview-divider" />
                <div><span>Total file size</span><strong>{formatSize(totalBytes)}</strong></div>
            </section>

            {error && <p className="documents-message is-error" role="alert">{error}</p>}
            {notice && <p className="documents-message is-success" role="status">{notice}</p>}

            <section className="documents-list-card">
                <div className="documents-list-heading">
                    <div>
                        <h2>Your files</h2>
                        <p>{visibleDocuments.length} document{visibleDocuments.length === 1 ? "" : "s"}</p>
                    </div>
                    <label className="documents-search">
                        <Search size={16} />
                        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search documents" aria-label="Search documents" />
                    </label>
                </div>

                <div className="documents-table-wrap">
                    <table className="documents-table">
                        <thead><tr><th>Name</th><th>Type</th><th>Size</th><th>Actions</th></tr></thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="documents-empty">Loading documents…</td></tr>
                            ) : visibleDocuments.length === 0 ? (
                                <tr><td colSpan="4" className="documents-empty">
                                    <FileText size={24} />
                                    <span>{search ? "No documents match your search." : "No documents yet. Upload a file to get started."}</span>
                                </td></tr>
                            ) : visibleDocuments.map((document) => (
                                <tr key={document.id}>
                                    <td><div className="documents-name"><span className="documents-file-icon"><FileText size={17} /></span><strong title={document.name}>{document.name}</strong></div></td>
                                    <td><span className="documents-type">{document.name?.split(".").pop()?.toUpperCase() || "FILE"}</span></td>
                                    <td>{formatSize(Number(document.size) || 0)}</td>
                                    <td><div className="documents-actions">
                                        <button type="button" onClick={() => handleDownload(document)} disabled={busyId === document.id} title="Download" aria-label={`Download ${document.name}`}><Download size={16} /></button>
                                        <button className="is-delete" type="button" onClick={() => handleDelete(document)} disabled={busyId === document.id} title="Delete" aria-label={`Delete ${document.name}`}><Trash2 size={16} /></button>
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="documents-footnote">Supported formats: PDF, XLSX, XLS, DOC, DOCX, JPG, JPEG</div>
            </section>
        </div>
    );
}

export default Documents;
