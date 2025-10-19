// import { useState, useEffect } from "react";
// import {
//   Container,
//   Typography,
//   Button,
//   Box,
//   TextField,
//   MenuItem,
//   IconButton,
//   Select,
//   InputLabel,
//   FormControl,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import {
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Save as SaveIcon,
//   Close as CloseIcon,
//   Bookmark as BookmarkIcon,
//   BookmarkBorder as BookmarkBorderIcon,
//   Description as DescriptionIcon, // icon for notes
// } from "@mui/icons-material";

// import dayjs from "dayjs";
// import duration from "dayjs/plugin/duration";
// import relativeTime from "dayjs/plugin/relativeTime";

// import axios from "axios";

// dayjs.extend(duration);
// dayjs.extend(relativeTime);

// export default function Dashboard() {
//   const [applications, setApplications] = useState([]);
//   const [company, setCompany] = useState("");
//   const [position, setPosition] = useState("");
//   const [link, setLink] = useState("");
//   const [applicationSource, setApplicationSource] = useState("");
//   const [customSource, setCustomSource] = useState("");

//   const [editId, setEditId] = useState(null);
//   const [editCompany, setEditCompany] = useState("");
//   const [editPosition, setEditPosition] = useState("");
//   const [editLink, setEditLink] = useState("");
//   const [editSource, setEditSource] = useState("");
//   const [editCustomSource, setEditCustomSource] = useState("");

//   // Notes state
//   const [openNote, setOpenNote] = useState(false);
//   const [noteText, setNoteText] = useState("");
//   const [currentNoteId, setCurrentNoteId] = useState(null);

//   // Search & Sort
//   const [search, setSearch] = useState("");
//   const [sortField, setSortField] = useState("");
//   const [sortOrder, setSortOrder] = useState("asc");

//   // Pagination
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 5;

//   const statusOptions = ["Sedang diproses", "Review", "Screened", "Ditolak", "Posisi ditutup"];
//   const sourceOptions = ["LinkedIn", "Jobstreet", "Kalibrr", "Email", "Other"];

//   // Format
//   const formatDateLong = (date) => {
//     if (!date) return "-";
//     return dayjs(date).format("D MMMM YYYY"); // contoh: 16 Maret 2025
//   };

//   // Hitung selisih Y/M/D antara fromDate dan today
//   const diffYMD = (fromDate, toDate = dayjs()) => {
//     if (!fromDate) return { y: 0, m: 0, d: 0 };
//     const start = dayjs(fromDate);
//     const end = dayjs(toDate);

//     let y = end.year() - start.year();
//     let m = end.month() - start.month();
//     let d = end.date() - start.date();

//     if (d < 0) {
//       // ambil hari terakhir bulan sebelumnya dari `end`
//       const lastDayPrevMonth = dayjs(end).date(1).subtract(1, "day").date();
//       d += lastDayPrevMonth;
//       m -= 1;
//     }
//     if (m < 0) {
//       m += 12;
//       y -= 1;
//     }

//     return { y, m, d };
//   };

//   const formatYMD = ({ y, m, d }) => {
//     const parts = [];
//     if (y) parts.push(`${y}y`);
//     if (m) parts.push(`${m}m`);
//     // selalu tunjukkan hari (jika 0, tampilkan 0d)
//     parts.push(`${d}d`);
//     return parts.join(" ");
//   };

//   const getElapsedLabel = (app) => {
//     const base = app.statusUpdatedAt ? app.statusUpdatedAt : app.createdAt;
//     const diff = diffYMD(base);
//     return formatYMD(diff);
//   };

//   // Fetch data
//   const fetchApplications = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/applications", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const sorted = res.data.sort((a, b) => {
//         if (a.bookmarked === b.bookmarked) {
//           return new Date(b.updatedAt) - new Date(a.updatedAt);
//         }
//         return b.bookmarked - a.bookmarked;
//       });
//       setApplications(sorted);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Add application
//   const addApplication = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const finalSource = applicationSource === "Other" ? customSource : applicationSource;

//       await axios.post(
//         "http://localhost:5000/api/applications",
//         { company, position, link, applicationSource: finalSource },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchApplications();
//       setCompany("");
//       setPosition("");
//       setLink("");
//       setApplicationSource("");
//       setCustomSource("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Delete application
//   const deleteApplication = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`http://localhost:5000/api/applications/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setApplications(applications.filter((app) => app._id !== id));
//     } catch (err) {
//       console.error("Delete failed", err);
//     }
//   };

//   // Update (edit / status / notes)
//   const updateApplication = async (id, data) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.put(
//         `http://localhost:5000/api/applications/${id}`,
//         data,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setApplications(applications.map((app) => (app._id === id ? res.data : app)));
//       setEditId(null); // reset the edit mode
//     } catch (err) {
//       console.error("Update failed", err);
//     }
//   };

//   // Bookmark toggle
//   const toggleBookmark = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.put(
//         `http://localhost:5000/api/applications/${id}/bookmark`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setApplications((prev) => {
//         const updated = prev.map((app) => (app._id === id ? res.data : app));
//         return updated.sort((a, b) => {
//           if (a.bookmarked === b.bookmarked) {
//             return new Date(b.updatedAt) - new Date(a.updatedAt);
//           }
//           return b.bookmarked - a.bookmarked;
//         });
//       });
//     } catch (err) {
//       console.error("Bookmark failed", err);
//     }
//   };

//   // Notes open
//   const handleOpenNote = (app) => {
//     setCurrentNoteId(app._id);
//     setNoteText(app.notes || "");
//     setOpenNote(true);
//   };

//   const handleSaveNote = async () => {
//     try {
//       await updateApplication(currentNoteId, { notes: noteText });
//       setOpenNote(false);
//     } catch (err) {
//       console.error("Failed to save note", err);
//     }
//   };

//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   // Filter + Sort
//   const filteredData = applications.filter(
//     (app) =>
//       app.company.toLowerCase().includes(search.toLowerCase()) ||
//       app.position.toLowerCase().includes(search.toLowerCase()) ||
//       (app.applicationSource && app.applicationSource.toLowerCase().includes(search.toLowerCase()))
//   );

//   const sortedData = [...filteredData].sort((a, b) => {
//     if (!sortField) return 0;
//     const valA = a[sortField] || "";
//     const valB = b[sortField] || "";
//     if (sortOrder === "asc") return valA.localeCompare(valB);
//     return valB.localeCompare(valA);
//   });

//   // Pagination
//   const totalPages = Math.ceil(sortedData.length / itemsPerPage);
//   const paginatedData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/";
//   };

//   return (
//     <Container maxWidth="lg">
//       <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <Typography variant="h4">Dashboard</Typography>
//         <Button variant="contained" color="error" onClick={handleLogout}>
//           Logout
//         </Button>
//       </Box>

//       {/* Form for adding applications */}
//       <Box sx={{ mt: 4 }}>
//         <TextField
//           label="Perusahaan"
//           fullWidth
//           margin="normal"
//           value={company}
//           onChange={(e) => setCompany(e.target.value)}
//         />
//         <TextField
//           label="Posisi"
//           fullWidth
//           margin="normal"
//           value={position}
//           onChange={(e) => setPosition(e.target.value)}
//         />
//         <TextField
//           label="Link"
//           fullWidth
//           margin="normal"
//           value={link}
//           onChange={(e) => setLink(e.target.value)}
//         />

//         {/* Dropdown for Source */}
//         <FormControl fullWidth margin="normal">
//           <InputLabel>Aplikasi</InputLabel>
//           <Select
//             value={applicationSource}
//             onChange={(e) => setApplicationSource(e.target.value)}
//             label="Aplikasi"
//           >
//             {sourceOptions.map((s) => (
//               <MenuItem key={s} value={s}>
//                 {s}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         {applicationSource === "Other" && (
//           <TextField
//             label="Sumber Lainnya"
//             fullWidth
//             margin="normal"
//             value={customSource}
//             onChange={(e) => setCustomSource(e.target.value)}
//           />
//         )}

//         <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={addApplication}>
//           Tambah Lamaran
//         </Button>
//       </Box>

//       {/* Search + Sort */}
//       <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
//         <TextField
//           label="Search (company, position, aplikasi)"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           sx={{ flex: 1 }}
//         />
//         <FormControl sx={{ minWidth: 150 }}>
//           <InputLabel>Sort by</InputLabel>
//           <Select value={sortField} onChange={(e) => setSortField(e.target.value)} label="Sort by">
//             <MenuItem value="">None</MenuItem>
//             <MenuItem value="status">Status</MenuItem>
//             <MenuItem value="applicationSource">Aplikasi</MenuItem>
//           </Select>
//         </FormControl>
//         <FormControl sx={{ minWidth: 120 }}>
//           <InputLabel>Order</InputLabel>
//           <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} label="Order">
//             <MenuItem value="asc">ASC</MenuItem>
//             <MenuItem value="desc">DESC</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>

//       {/* Table with pagination */}
//       <Box sx={{ mt: 4, overflowX: "auto" }}>
//         <Typography variant="h5">Daftar Lamaran</Typography>
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             marginTop: "16px",
//             minWidth: "950px",
//           }}
//         >
//           <thead>
//             <tr style={{ backgroundColor: "#f0f0f0" }}>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Job Position</th>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Company</th>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Link</th>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Aplikasi</th>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Status</th>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Tanggal Masuk</th>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Tanggal Update</th>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Days</th>
//               <th style={{ padding: "10px", border: "1px solid #ccc" }}>Actions</th>
//             </tr>
//           </thead>
//          <tbody>
//   {paginatedData.map((app) => {
//     const diff = diffYMD(app.statusUpdatedAt ? app.statusUpdatedAt : app.createdAt);
//     const isOverOneMonth = diff.y > 0 || diff.m > 0; // lebih dari 1 bulan

//     return (
//       <tr
//         key={app._id}
//         style={{
//           backgroundColor: isOverOneMonth ? "#ffe5e5" : "transparent", // merah muda kalau > 1 bulan
//         }}
//       >
//         <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//           {editId === app._id ? (
//             <TextField
//               value={editPosition}
//               onChange={(e) => setEditPosition(e.target.value)}
//               size="small"
//               fullWidth
//             />
//           ) : (
//             app.position
//           )}
//         </td>
//         <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//           {editId === app._id ? (
//             <TextField
//               value={editCompany}
//               onChange={(e) => setEditCompany(e.target.value)}
//               size="small"
//               fullWidth
//             />
//           ) : (
//             app.company
//           )}
//         </td>
//         <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//           {editId === app._id ? (
//             <TextField
//               value={editLink}
//               onChange={(e) => setEditLink(e.target.value)}
//               size="small"
//               fullWidth
//             />
//           ) : (
//             <a href={app.link} target="_blank" rel="noreferrer">
//               {app.link}
//             </a>
//           )}
//         </td>
//         <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//           {editId === app._id ? (
//             <FormControl fullWidth size="small">
//               <Select
//                 value={editSource}
//                 onChange={(e) => setEditSource(e.target.value)}
//               >
//                 {sourceOptions.map((s) => (
//                   <MenuItem key={s} value={s}>
//                     {s}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           ) : (
//             app.applicationSource
//           )}
//         </td>
//         <td style={{ border: "1px solid #ccc", padding: "8px" }}>
//           <TextField
//             select
//             value={app.status}
//             onChange={(e) => updateApplication(app._id, { status: e.target.value })}
//             size="small"
//             fullWidth
//           >
//             {statusOptions.map((s) => (
//               <MenuItem key={s} value={s}>{s}</MenuItem>
//             ))}
//           </TextField>
//         </td>

//         {/* Tanggal Masuk */}
//         <td style={{ border: "1px solid #ccc", padding: 8, textAlign: "center" }}>
//           {formatDateLong(app.createdAt)}
//         </td>

//         {/* Tanggal Update */}
//         <td style={{ border: "1px solid #ccc", padding: 8, textAlign: "center" }}>
//           {app.statusUpdatedAt ? formatDateLong(app.statusUpdatedAt) : "-"}
//         </td>

//         {/* Days */}
//         <td style={{ border: "1px solid #ccc", padding: 8, textAlign: "center" }}>
//           {getElapsedLabel(app)}
//         </td>

//         {/* Actions */}
//         <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
//           {editId === app._id ? (
//             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//               <IconButton
//                 color="primary"
//                 onClick={() =>
//                   updateApplication(app._id, {
//                     company: editCompany,
//                     position: editPosition,
//                     link: editLink,
//                     applicationSource: editSource,
//                   })
//                 }
//               >
//                 <SaveIcon />
//               </IconButton>
//               <IconButton color="error" onClick={() => setEditId(null)}>
//                 <CloseIcon />
//               </IconButton>
//             </Box>
//           ) : (
//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: 1,
//                 justifyItems: "center",
//               }}
//             >
//               <IconButton
//                 color="primary"
//                 onClick={() => {
//                   setEditId(app._id);
//                   setEditCompany(app.company);
//                   setEditPosition(app.position);
//                   setEditLink(app.link);
//                   setEditSource(app.applicationSource);
//                 }}
//               >
//                 <EditIcon />
//               </IconButton>
//               <IconButton color="error" onClick={() => deleteApplication(app._id)}>
//                 <DeleteIcon />
//               </IconButton>
//               <IconButton color="secondary" onClick={() => handleOpenNote(app)}>
//                 <DescriptionIcon />
//               </IconButton>
//               <IconButton onClick={() => toggleBookmark(app._id)}>
//                 {app.bookmarked ? (
//                   <BookmarkIcon color="warning" />
//                 ) : (
//                   <BookmarkBorderIcon />
//                 )}
//               </IconButton>
//             </Box>
//           )}
//         </td>
//       </tr>
//     );
//   })}
// </tbody>

//         </table>
//       </Box>

//       {/* Modal Notes */}
//       <Dialog open={openNote} onClose={() => setOpenNote(false)} fullWidth>
//         <DialogTitle>Catatan</DialogTitle>
//         <DialogContent>
//           <TextField
//             value={noteText}
//             onChange={(e) => setNoteText(e.target.value)}
//             fullWidth
//             multiline
//             rows={4}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenNote(false)}>Cancel</Button>
//           <Button onClick={handleSaveNote} variant="contained">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// }


import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  IconButton,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,   // ⬅️ tambahin ini
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Description as DescriptionIcon, // icon for notes
} from "@mui/icons-material";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

import axios from "axios";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [link, setLink] = useState("");
  const [applicationSource, setApplicationSource] = useState("");
  const [customSource, setCustomSource] = useState("");

  const [editId, setEditId] = useState(null);
  const [editCompany, setEditCompany] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editSource, setEditSource] = useState("");
  const [editCustomSource, setEditCustomSource] = useState("");

  // Notes state
  const [openNote, setOpenNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [currentNoteId, setCurrentNoteId] = useState(null);

  // Search & Sort
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const statusOptions = ["Sedang diproses", "Review", "Screened", "Ditolak", "Posisi ditutup"];
  const sourceOptions = ["LinkedIn", "Jobstreet", "Kalibrr", "Email", "Other"];

  // Format
  const formatDateLong = (date) => {
    if (!date) return "-";
    return dayjs(date).format("D MMMM YYYY"); // contoh: 16 Maret 2025
  };

  // Hitung selisih Y/M/D antara fromDate dan today
  const diffYMD = (fromDate, toDate = dayjs()) => {
    if (!fromDate) return { y: 0, m: 0, d: 0 };
    const start = dayjs(fromDate);
    const end = dayjs(toDate);

    let y = end.year() - start.year();
    let m = end.month() - start.month();
    let d = end.date() - start.date();

    if (d < 0) {
      // ambil hari terakhir bulan sebelumnya dari `end`
      const lastDayPrevMonth = dayjs(end).date(1).subtract(1, "day").date();
      d += lastDayPrevMonth;
      m -= 1;
    }
    if (m < 0) {
      m += 12;
      y -= 1;
    }

    return { y, m, d };
  };

  const formatYMD = ({ y, m, d }) => {
    const parts = [];
    if (y) parts.push(`${y}y`);
    if (m) parts.push(`${m}m`);
    // selalu tunjukkan hari (jika 0, tampilkan 0d)
    parts.push(`${d}d`);
    return parts.join(" ");
  };

  const getElapsedLabel = (app) => {
    const base = app.statusUpdatedAt ? app.statusUpdatedAt : app.createdAt;
    const diff = diffYMD(base);
    return formatYMD(diff);
  };

  // Fetch data
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = res.data.sort((a, b) => {
        if (a.bookmarked === b.bookmarked) {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        }
        return b.bookmarked - a.bookmarked;
      });
      setApplications(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  // Add application
  const addApplication = async () => {
    try {
      const token = localStorage.getItem("token");
      const finalSource = applicationSource === "Other" ? customSource : applicationSource;

      await axios.post(
        "http://localhost:5000/api/applications",
        { company, position, link, applicationSource: finalSource },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplications();
      setCompany("");
      setPosition("");
      setLink("");
      setApplicationSource("");
      setCustomSource("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete application
  const deleteApplication = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(applications.filter((app) => app._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // Update (edit / status / notes)
  const updateApplication = async (id, data) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/applications/${id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(applications.map((app) => (app._id === id ? res.data : app)));
      setEditId(null); // reset the edit mode
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // Bookmark toggle
  const toggleBookmark = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/applications/${id}/bookmark`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications((prev) => {
        const updated = prev.map((app) => (app._id === id ? res.data : app));
        return updated.sort((a, b) => {
          if (a.bookmarked === b.bookmarked) {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          }
          return b.bookmarked - a.bookmarked;
        });
      });
    } catch (err) {
      console.error("Bookmark failed", err);
    }
  };

  // Notes open
  const handleOpenNote = (app) => {
    setCurrentNoteId(app._id);
    setNoteText(app.notes || "");
    setOpenNote(true);
  };

  const handleSaveNote = async () => {
    try {
      await updateApplication(currentNoteId, { notes: noteText });
      setOpenNote(false);
    } catch (err) {
      console.error("Failed to save note", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filter + Sort
  const filteredData = applications.filter(
    (app) =>
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.position.toLowerCase().includes(search.toLowerCase()) ||
      (app.applicationSource && app.applicationSource.toLowerCase().includes(search.toLowerCase()))
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField] || "";
    const valB = b[sortField] || "";
    if (sortOrder === "asc") return valA.localeCompare(valB);
    return valB.localeCompare(valA);
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4">Dashboard</Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Form for adding applications */}
      <Box sx={{ mt: 4 }}>
        <TextField
          label="Perusahaan"
          fullWidth
          margin="normal"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <TextField
          label="Posisi"
          fullWidth
          margin="normal"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <TextField
          label="Link"
          fullWidth
          margin="normal"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        {/* Dropdown for Source */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Aplikasi</InputLabel>
          <Select
            value={applicationSource}
            onChange={(e) => setApplicationSource(e.target.value)}
            label="Aplikasi"
          >
            {sourceOptions.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {applicationSource === "Other" && (
          <TextField
            label="Sumber Lainnya"
            fullWidth
            margin="normal"
            value={customSource}
            onChange={(e) => setCustomSource(e.target.value)}
          />
        )}

        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={addApplication}>
          Tambah Lamaran
        </Button>
      </Box>

      {/* Search + Sort */}
      <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Search (company, position, aplikasi)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sortField} onChange={(e) => setSortField(e.target.value)} label="Sort by">
            <MenuItem value="">None</MenuItem>
            <MenuItem value="status">Status</MenuItem>
            <MenuItem value="applicationSource">Aplikasi</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Order</InputLabel>
          <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} label="Order">
            <MenuItem value="asc">ASC</MenuItem>
            <MenuItem value="desc">DESC</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table with pagination */}
      <Box sx={{ mt: 4, overflowX: "auto" }}>
        <Typography variant="h5">Daftar Lamaran</Typography>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "16px",
            minWidth: "950px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Job Position</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Company</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Link</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Aplikasi</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Status</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Tanggal Masuk</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Tanggal Update</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Days</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>Actions</th>
            </tr>
          </thead>
         <tbody>
  {paginatedData.map((app) => {
    const diff = diffYMD(app.statusUpdatedAt ? app.statusUpdatedAt : app.createdAt);
    const isOverOneMonth = diff.y > 0 || diff.m > 0; // lebih dari 1 bulan
    const isRejected = app.status === "Ditolak"; // kalau status ditolak


    return (
      <tr
        key={app._id}
        style={{
          backgroundColor: isRejected || isOverOneMonth ? "#ffe5e5" : "transparent", // merah muda kalau > 1 bulan
        }}
      >
        <td style={{ border: "1px solid #ccc", padding: "8px" }}>
          {editId === app._id ? (
            <TextField
              value={editPosition}
              onChange={(e) => setEditPosition(e.target.value)}
              size="small"
              fullWidth
            />
          ) : (
            app.position
          )}
        </td>
        <td style={{ border: "1px solid #ccc", padding: "8px" }}>
          {editId === app._id ? (
            <TextField
              value={editCompany}
              onChange={(e) => setEditCompany(e.target.value)}
              size="small"
              fullWidth
            />
          ) : (
            app.company
          )}
        </td>
        <td style={{ border: "1px solid #ccc", padding: "8px" }}>
          {editId === app._id ? (
            <TextField
              value={editLink}
              onChange={(e) => setEditLink(e.target.value)}
              size="small"
              fullWidth
            />
          ) : (
            <a href={app.link} target="_blank" rel="noreferrer">
              {app.link}
            </a>
          )}
        </td>
        <td style={{ border: "1px solid #ccc", padding: "8px" }}>
          {editId === app._id ? (
            <FormControl fullWidth size="small">
              <Select
                value={editSource}
                onChange={(e) => setEditSource(e.target.value)}
              >
                {sourceOptions.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            app.applicationSource
          )}
        </td>
        <td style={{ border: "1px solid #ccc", padding: "8px" }}>
          <TextField
            select
            value={app.status}
            onChange={(e) => updateApplication(app._id, { status: e.target.value })}
            size="small"
            fullWidth
          >
            {statusOptions.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
        </td>

        {/* Tanggal Masuk */}
        <td style={{ border: "1px solid #ccc", padding: 8, textAlign: "center" }}>
          {formatDateLong(app.createdAt)}
        </td>
        

        {/* Tanggal Update */}
        <td style={{ border: "1px solid #ccc", padding: 8, textAlign: "center" }}>
          {app.statusUpdatedAt ? formatDateLong(app.statusUpdatedAt) : "-"}
        </td>

        {/* Days */}
        <td style={{ border: "1px solid #ccc", padding: 8, textAlign: "center" }}>
          {getElapsedLabel(app)}
        </td>

        {/* Actions */}
        <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
          {editId === app._id ? (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <IconButton
                color="primary"
                onClick={() =>
                  updateApplication(app._id, {
                    company: editCompany,
                    position: editPosition,
                    link: editLink,
                    applicationSource: editSource,
                  })
                }
              >
                <SaveIcon />
              </IconButton>
              <IconButton color="error" onClick={() => setEditId(null)}>
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1,
                justifyItems: "center",
              }}
            >
              <IconButton
                color="primary"
                onClick={() => {
                  setEditId(app._id);
                  setEditCompany(app.company);
                  setEditPosition(app.position);
                  setEditLink(app.link);
                  setEditSource(app.applicationSource);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => deleteApplication(app._id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton color="secondary" onClick={() => handleOpenNote(app)}>
                <DescriptionIcon />
              </IconButton>
              <IconButton onClick={() => toggleBookmark(app._id)}>
                {app.bookmarked ? (
                  <BookmarkIcon color="warning" />
                ) : (
                  <BookmarkBorderIcon />
                )}
              </IconButton>
            </Box>
          )}
        </td>
      </tr>
    );
  })}
</tbody>

        </table>
      </Box>

      {totalPages > 1 && (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
    <Pagination
      count={totalPages}
      page={page}
      onChange={(e, value) => setPage(value)}
      color="primary"
      showFirstButton
      showLastButton
    />
  </Box>
)}

      {/* Modal Notes */}
      <Dialog open={openNote} onClose={() => setOpenNote(false)} fullWidth>
        <DialogTitle>Catatan</DialogTitle>
        <DialogContent>
          <TextField
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNote(false)}>Cancel</Button>
          <Button onClick={handleSaveNote} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

