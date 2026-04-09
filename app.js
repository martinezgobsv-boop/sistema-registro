// Funciones principales

function agregarRegistro() {
  const ampo = document.getElementById("ampo").value;
  const digitador = document.getElementById("digitador").value;
  const fecha = document.getElementById("fecha").value;
  const cantidad = document.getElementById("cantidad").value;

  if(!ampo || !digitador || !fecha || !cantidad) {
    alert("Completa todos los campos");
    return;
  }

  const nuevo = { ampo, digitador, fecha, cantidad, estado: "pendiente" };
  let registros = JSON.parse(localStorage.getItem("registros")) || [];
  registros.push(nuevo);
  localStorage.setItem("registros", JSON.stringify(registros));

  limpiarFormulario();
  actualizarPantalla();
}

function limpiarFormulario() {
  document.getElementById("ampo").value = "";
  document.getElementById("digitador").value = "";
  document.getElementById("fecha").value = "";
  document.getElementById("cantidad").value = "";
}

function actualizarPantalla() {
  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  const pendientes = registros.filter(r => r.estado === "pendiente");
  const finalizados = registros.filter(r => r.estado === "finalizado");

  document.getElementById("pendientes").innerHTML = pendientes.map((r, i) =>
    `<li>
      ${r.ampo} - ${r.digitador} - ${r.cantidad}
      <button onclick="finalizar(${i})">✔️</button>
    </li>`).join('');

  document.getElementById("finalizados").innerHTML = finalizados.map(r =>
    `<li>${r.ampo} - ${r.digitador} - ${r.cantidad}</li>`).join('');

  document.getElementById("totalPendientes").innerText = pendientes.length;
  document.getElementById("totalFinalizados").innerText = finalizados.length;

  // Último registro del día
  const hoy = new Date().toISOString().split("T")[0];
  const hoyRegistros = registros.filter(r => r.fecha === hoy);
  if(hoyRegistros.length > 0) {
    const u = hoyRegistros[hoyRegistros.length - 1];
    document.getElementById("ultimoRegistro").innerHTML = `
      <b>AMPO:</b> ${u.ampo} <br>
      <b>Digitador:</b> ${u.digitador} <br>
      <b>Cantidad:</b> ${u.cantidad}
    `;
  } else {
    document.getElementById("ultimoRegistro").innerHTML = "No hay registros hoy";
  }
}

function finalizar(index) {
  let registros = JSON.parse(localStorage.getItem("registros")) || [];
  registros[index].estado = "finalizado";
  localStorage.setItem("registros", JSON.stringify(registros));
  actualizarPantalla();
}

function limpiarTodo() {
  if(confirm("¿Deseas eliminar todos los registros?")) {
    localStorage.removeItem("registros");
    actualizarPantalla();
  }
}

function exportarCSV() {
  const registros = JSON.parse(localStorage.getItem("registros")) || [];
  let csv = "AMPO,Digitador,Fecha,Cantidad,Estado\n";
  registros.forEach(r => {
    csv += `${r.ampo},${r.digitador},${r.fecha},${r.cantidad},${r.estado}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "registros.csv";
  link.click();
}

// Inicializar pantalla
window.onload = actualizarPantalla;
