// CONTEÚDO ORIGINAL RESTAURADO (COM TODA A ROBUSTEZ DO GPT)
if (window.__ISRC_EXTRACT_RUNNING__) {
  console.warn("[B3M] Extrator já em execução.");
} else {
  window.__ISRC_EXTRACT_RUNNING__ = true;

  window.addEventListener("message", async (event) => {
    if (event.data.type !== "START_ISRC_EXTRACTION") return;

    console.log("[B3M] A iniciar extração robusta...");
    
    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    await sleep(2000);

    let albumName = "B3M_Export";
    const ogTitle = document.querySelector("meta[property='og:title']");
    if (ogTitle && ogTitle.content) {
      albumName = ogTitle.content.trim();
    }

    // Mantendo o fallback em cascata que eu tinha removido erradamente
    if (albumName === "B3M_Export" && document.title && !document.title.toLowerCase().includes("distrokid")) {
      albumName = document.title.trim();
    }

    const results = [];
    const tracks = document.querySelectorAll("[data-testid='track-row'], .trackRow");

    for (const track of tracks) {
      const expandBtn = track.querySelector("button") || track.querySelector("[aria-expanded]");
      if (expandBtn) {
        expandBtn.click();
        await sleep(400); // Essencial para dar tempo ao DOM
      }

      const text = track.innerText;
      const isrcMatch = text.match(/ISRC[:\s]*([A-Z0-9]+)/);
      const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
      const titleLine = lines.find(l => !/^\d+$/.test(l));

      if (isrcMatch && titleLine) {
        results.push({ musica: titleLine, isrc: isrcMatch[1] });
      }
    }

    if (results.length === 0) {
      alert("Nenhuma faixa encontrada. Certifica-te de que os detalhes estão visíveis.");
      window.__ISRC_EXTRACT_RUNNING__ = false;
      return;
    }

    // EXPORTAÇÃO LIMPA PARA A ABRAMUS
    let csv = "\uFEFFTrack;ISRC\n"; 
    results.forEach(track => {
      csv += `"${track.musica.replace(/"/g, '""')}";"${track.isrc}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${albumName.replace(/[^\w\s]/gi, "")}_B3M.csv`; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    console.log("[B3M] Extração concluída com sucesso.");
    window.__ISRC_EXTRACT_RUNNING__ = false;
  });
}