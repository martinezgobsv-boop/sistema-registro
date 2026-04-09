let usuarioActual = "";

// LOGIN
function login() {
  const select = document.getElementById("usuarioSelect");
  usuarioActual = select.value;
  if(!usuarioActual) { alert("Selecciona un usuario"); return; }

  document.getElementById("loginCard").style.display = "none";
  document.getElementById("sistema").style.display = "block";
  document.getElementById("rolUsuario").innerText = "Usuario: " + usuarioActual;
  actualizarPantalla();
}

function logout() {
  usuarioActual = "";
  document.getElementById("loginCard").style.display = "block";
  document.getElementById("sistema").style.display = "none";
}

// REGISTROS
function agregarRegistro() {
  const ampo = document.getElementById("ampo").value;
  const digitador = document.getElementById("digitador").value;
  const fecha = document.getElementById("fecha").value;
  const cantidad = document.getElementById("cantidad").value;

  if(!ampo || !digitador || !fecha || !cantidad) { alert("Completa todos los campos"); return; }

  const nuevo = { usuario: usuarioActual, ampo, digitador, fecha, cantidad, estado: "pendiente" };
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

// PANTALLA
function actualizarPantalla() {
  let registros = JSON.parse(localStorage.getItem("registros")) || [];
  let misRegistros = registros.filter(r => r.usuario === usuarioActual);

  const pendientes = misRegistros.filter(r => r.estado === "pendiente");
  const finalizados = misRegistros.filter(r => r.estado === "finalizado");

  document.getElementById("pendientes").innerHTML = pendientes.map((r,i) =>
    `<li>
      ${r.ampo} - ${r.digitador} - ${r.cantidad}
      <span>
        <button onclick="editar(${i})">✏️</button>
        <button onclick="eliminar(${i})">🗑️</button>
        <button onclick="finalizar(${i})">✔️</button>
      </span>
    </li>`).join('');

  document.getElementById("finalizados").innerHTML = finalizados.map((r,i) =>
    `<li>${r.ampo} - ${r.digitador} - ${r.cantidad}
      <button onclick="eliminarFinalizado(${i})">🗑️</button>
    </li>`).join('');

  document.getElementById("totalPendientes").innerText = pendientes.length;
  document.getElementById("totalFinalizados").innerText = finalizados.length;

  // Último registro del día
  const hoy = new Date().toISOString().split("T")[0];
  const hoyRegistros = misRegistros.filter(r => r.fecha === hoy);
  if(hoyRegistros.length > 0) {
    const u = hoyRegistros[hoyRegistros.length-1];
    document.getElementById("ultimoRegistro").innerHTML =
      `<b>AMPO:</b> ${u.ampo} <br>
       <b>Digitador:</b> ${u.digitador} <br>
       <b>Cantidad:</b> ${u.cantidad}`;
  } else {
    document.getElementById("ultimoRegistro").innerHTML = "No hay registros hoy";
  }
}

// FUNCIONES DE ACCIÓN
function finalizar(index) {
  let registros = JSON.parse(localStorage.getItem("registros")) || [];
  let misRegistros = registros.filter(r => r.usuario === usuarioActual);
  let reg = misRegistros[index];

  registros = registros.map(r => {
    if(r === reg) r.estado = "finalizado";
    return r;
  });
  localStorage.setItem("registros", JSON.stringify(registros));
  actualizarPantalla();
}

function eliminar(index) {
  let registros = JSON.parse(localStorage.getItem("registros")) || [];
  let misRegistros = registros.filter(r => r.usuario === usuarioActual);
  let reg = misRegistros[index];
  registros = registros.filter(r => r !== reg);
  localStorage.setItem("registros", JSON.stringify(registros));
  actualizarPantalla();
}

function eliminarFinalizado(index) {
  let registros = JSON.parse(localStorage.getItem("registros")) || [];
  let misRegistros = registros.filter(r => r.usuario === usuarioActual && r.estado==="finalizado");
  let reg = misRegistros[index];
  registros = registros.filter(r => r !== reg);
  localStorage.setItem("registros", JSON.stringify(registros));
  actualizarPantalla();
}

function editar(index) {
  let registros = JSON.parse(localStorage.getItem("registros")) || [];
  let misRegistros = registros.filter(r => r.usuario === usuarioActual && r.estado==="pendiente");
  let reg = misRegistros[index];

  document.getElementById("ampo").value = reg.ampo;
  document.getElementById("digitador").value = reg.digitador;
  document.getElementById("fecha").value = reg.fecha;
  document.getElementById("cantidad").value = reg.cantidad;

  eliminar(index);
}

// EXPORTAR CSV
function exportarCSV() {
  let registros = JSON.parse(localStorage.getItem("registros")) || [];
  registros = registros.filter(r => r.usuario === usuarioActual);
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

window.onload = () => {
  if(usuarioActual) actualizarPantalla();
};
