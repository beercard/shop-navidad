"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser";
import { AlertIcon, ScanIcon, SpinnerIcon, SwitchCameraIcon } from "./icons";
import { haptics } from "./haptics";
import styles from "./merchant.module.css";

export function QrScanner({ onCode, onClose, onError }: { onCode: (value: string) => void; onClose: () => void; onError: (message: string) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const controls = useRef<IScannerControls | null>(null);
  const readOnce = useRef(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [starting, setStarting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");

  function stop() {
    controls.current?.stop();
    controls.current = null;
    setScanning(false);
  }

  async function start(requestedDeviceId?: string) {
    stop();
    setCameraError("");
    onError("");
    readOnce.current = false;
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("La cámara necesita una conexión segura (HTTPS). Podés ingresar el código manualmente.");
      return;
    }
    if (!video.current) return;
    setStarting(true);
    try {
      const reader = new BrowserQRCodeReader();
      controls.current = await reader.decodeFromVideoDevice(requestedDeviceId, video.current, (result, _error, readerControls) => {
        if (!result || readOnce.current) return;
        readOnce.current = true;
        readerControls.stop();
        controls.current = null;
        setScanning(false);
        haptics.scan();
        onCode(result.getText());
      });
      setScanning(true);
      setDevices(await BrowserQRCodeReader.listVideoInputDevices());
      setDeviceId(requestedDeviceId ?? "");
    } catch (cause) {
      const name = cause instanceof DOMException ? cause.name : "";
      const message = name === "NotAllowedError" || name === "SecurityError"
        ? "No se habilitó el permiso de cámara. Activalo en los ajustes del navegador o ingresá el código manualmente."
        : name === "NotFoundError" || name === "DevicesNotFoundError"
          ? "No encontramos una cámara disponible en este dispositivo. Podés ingresar el código manualmente."
          : name === "NotReadableError" || name === "TrackStartError"
            ? "La cámara está ocupada por otra aplicación. Cerrala y volvé a intentar, o ingresá el código."
            : "No pudimos iniciar la cámara. Revisá los permisos o ingresá el código manualmente.";
      setCameraError(message);
      stop();
    } finally { setStarting(false); }
  }

  useEffect(() => {
    const release = () => { controls.current?.stop(); controls.current = null; };
    const onHidden = () => { if (document.hidden) { release(); setScanning(false); } };
    document.addEventListener("visibilitychange", onHidden);
    return () => { document.removeEventListener("visibilitychange", onHidden); release(); };
  }, []);

  const status = starting ? "Abriendo la cámara…" : scanning ? "" : "Cámara apagada";

  return <section className={styles.scanner} aria-labelledby="scanner-title">
    <div className={styles.scannerHead}>
      <h2 id="scanner-title">Escaneá el QR</h2>
      <button className={`${styles.button} ${styles.buttonSecondary}`} style={{ minHeight: 48, padding: "8px 18px", fontSize: 16 }} type="button" onClick={() => { stop(); onClose(); }}>Cerrar</button>
    </div>
    <div className={styles.cameraFrame} data-scanning={scanning}>
      <video ref={video} muted playsInline aria-label="Vista de la cámara para escanear el código QR" />
      <span className={styles.cameraGuide} aria-hidden="true"><i /></span>
      {!scanning && <div className={styles.cameraPlaceholder} role="status">{starting ? <SpinnerIcon className={styles.spin} width={20} height={20} /> : null}{status}</div>}
    </div>
    {cameraError && <p className={styles.notice} data-kind="error" role="alert"><AlertIcon width={20} height={20} /><span>{cameraError}</span></p>}
    {!scanning && !cameraError && !starting && <p className={styles.permissionNote}>Al tocar el botón, el navegador te va a pedir permiso para usar la cámara. Solo se usa para leer el QR del cupón; no se guarda ninguna imagen.</p>}
    <div className={styles.scannerActions}>
      {scanning
        ? <button className={`${styles.button} ${styles.buttonSecondary} ${styles.buttonWide}`} type="button" onClick={stop}>Pausar cámara</button>
        : <button className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonWide} ${styles.buttonBig}`} type="button" onClick={() => void start(deviceId || undefined)} disabled={starting}>{starting ? <SpinnerIcon className={styles.spin} /> : <ScanIcon />}{starting ? "Abriendo cámara…" : cameraError ? "Volver a intentar" : "Permitir cámara y escanear"}</button>}
      {scanning && devices.length > 1 && <label className={styles.cameraSelect}><span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><SwitchCameraIcon width={18} height={18} />Cambiar de cámara</span><select className={styles.select} value={deviceId} onChange={(event) => { setDeviceId(event.target.value); void start(event.target.value); }}><option value="">Cámara trasera o predeterminada</option>{devices.map((item, index) => <option key={item.deviceId} value={item.deviceId}>{item.label || `Cámara ${index + 1}`}</option>)}</select></label>}
    </div>
    <p className={styles.reassure}>Si el QR no se lee, cerrá el escáner e ingresá el código manualmente. Leer el QR solo consulta el cupón; no lo canjea.</p>
  </section>;
}
