// script.js
document.addEventListener("DOMContentLoaded", () => {
    updateLiveAntrian();
    setInterval(updateLiveAntrian, 10000); // update tiap 10 detik
});

document.getElementById("formDaftar").addEventListener("submit", function(e) {
    e.preventDefault();

    const nama = document.getElementById("nama").value;
    const nik = document.getElementById("nik").value;
    const hp = document.getElementById("hp").value;
    const poli = document.getElementById("poli").value;
    const jenis = document.getElementById("jenis_pasien").value;

    // Generate nomor antrian (contoh: UMUM-001)
    let prefix = poli === "umum" ? "UM" : poli === "gigi" ? "GG" : poli === "anak" ? "AN" : "KB";
    let counter = (localStorage.getItem(`counter_${poli}`) || 0) * 1 + 1;
    localStorage.setItem(`counter_${poli}`, counter);

    const nomorAntrian = `${prefix}${counter.toString().padStart(3,'0')}`;
    const tanggal = new Date().toLocaleDateString('id-ID');

    // Simpan data pasien
    const dataPasien = { nama, nik, hp, poli, jenis, nomorAntrian, tanggal, status: "Menunggu", waktu: new Date().toISOString() };
    localStorage.setItem(nomorAntrian, JSON.stringify(dataPasien));

    // Tampilkan hasil
    document.getElementById("infoAntrian").innerHTML = `
        <p><strong>Nomor Antrian:</strong> <span style="font-size:28px;color:#00aaff;">${nomorAntrian}</span></p>
        <p><strong>Nama:</strong> ${nama}</p>
        <p><strong>Poli:</strong> ${document.querySelector(`#poli option[value="${poli}"]`).text}</p>
        <p><strong>Tanggal:</strong> ${tanggal}</p>
        <p><strong>Status:</strong> <span style="color:orange;">Menunggu Dipanggil</span></p>
    `;
    document.getElementById("hasilDaftar").style.display = "block";
    document.getElementById("formDaftar").reset();
});

function cekAntrian() {
    const no = document.getElementById("noAntrianCek").value.toUpperCase().trim();
    const data = localStorage.getItem(no);
    if (data) {
        const p = JSON.parse(data);
        document.getElementById("tampilAntrian").innerHTML = `
            <div style="background:white;padding:20px;border-radius:10px;margin-top:20px;">
                <h3>Status Antrian Anda</h3>
                <p><strong>Nomor Antrian:</strong> ${p.nomorAntrian}</p>
                <p><strong>Nama:</strong> ${p.nama}</p>
                <p><strong>Poli:</strong> ${document.querySelector(`#poli option[value="${p.poli}"]`)?.text || p.poli}</p>
                <p><strong>Status:</strong> <span style="color:#e67e22;font-weight:bold;">${p.status}</span></p>
            </div>
        `;
    } else {
        document.getElementById("tampilAntrian").innerHTML = `<p style="color:red;">Nomor antrian tidak ditemukan!</p>`;
    }
}

function updateLiveAntrian() {
    let html = "";
    const polis = ["umum","gigi","anak","kia"];
    polis.forEach(p => {
        let namaPoli = p === "umum" ? "Poli Umum" : p === "gigi" ? "Poli Gigi" : p === "anak" ? "Poli Anak" : "Poli KIA";
        let prefix = p === "umum" ? "UM" : p === "gigi" ? "GG" : p === "anak" ? "AN" : "KB";
        let antrianHariIni = [];
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key.startsWith(prefix)) {
                let data = JSON.parse(localStorage.getItem(key));
                if (new Date(data.tanggal).toDateString() === new Date().toDateString()) {
                    antrianHariIni.push(data);
                }
            }
        }
        antrianHariIni.sort((a,b) => a.waktu.localeCompare(b.waktu));
        let sedang = antrianHariIni.find(x => x.status === "Sedang Diperiksa") || antrianHariIni[0];
        let nomorSekarang = sedang ? sedang.nomorAntrian : "-";

        html += `
            <div class="antrian-box">
                <h3>${namaPoli}</h3>
                <p>Sedang Dipanggil</p>
                <h1 style="font-size:60px;margin:10px 0;">${nomorSekarang}</h1>
                <p>Menunggu: ${antrianHariIni.filter(x => x.status === "Menunggu").length} orang</p>
            </div>
        `;
    });
    document.getElementById("liveAntrian").innerHTML = html || "<p>Belum ada antrian hari ini</p>";
}

// Tutup modal
document.querySelector(".close").onclick = () => {
    document.getElementById("hasilDaftar").style.display = "none";
};

// Hamburger menu
document.querySelector(".hamburger").onclick = () => {
    document.querySelector(".nav-menu").classList.toggle("active");
};
