import { useState } from "react";
import type { FormEvent } from "react";
import type { CrearMantenimiento, Equipo, Mantenimiento } from "../../types";

interface Props {
  registro: Mantenimiento | null;
  equipos: Equipo[];
  loading: boolean;
  onSubmit: (datos: CrearMantenimiento) => Promise<void>;
  onCancel: () => void;
}

const fechaLocal = (value: string) => {
  const fecha = new Date(value);
  if (Number.isNaN(fecha.getTime())) return "";
  return new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};
const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100";

export const MantenimientoForm = ({
  registro,
  equipos,
  loading,
  onSubmit,
  onCancel,
}: Props) => {
  const [estado, setEstado] = useState<Mantenimiento["estado"]>(
    registro?.estado ?? "pendiente",
  );
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const texto = (key: string) => String(form.get(key) ?? "").trim();
    await onSubmit({
      id_equipo: registro?.id_equipo ?? Number(texto("id_equipo")),
      fecha_inicio: new Date(texto("fecha_inicio")).toISOString(),
      fecha_fin:
        estado === "completado" && texto("fecha_fin")
          ? new Date(texto("fecha_fin")).toISOString()
          : null,
      estado,
      descripcion_falla: texto("descripcion_falla"),
      responsable: texto("responsable") || null,
      repuestos: texto("repuestos") || null,
      observaciones: texto("observaciones") || null,
    });
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <fieldset disabled={loading} className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Equipo
          <select
            name="id_equipo"
            required
            disabled={!!registro}
            defaultValue={registro?.id_equipo ?? ""}
            className={inputClass}
          >
            <option value="">Seleccionar equipo</option>
            {registro && !equipos.some((e) => e.id === registro.id_equipo) && (
              <option value={registro.id_equipo}>
                Equipo #{registro.id_equipo}
              </option>
            )}
            {equipos.map((e) => (
              <option
                key={e.id}
                value={e.id}
                disabled={
                  !registro &&
                  estado !== "completado" &&
                  ["Prestado", "Solicitado"].includes(e.estado_operativo)
                }
              >
                {e.nombre} · {e.nro_patrimonio || `#${e.id}`} ·{" "}
                {e.estado_operativo}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-gray-700">
            Estado
            <select
              value={estado}
              onChange={(e) =>
                setEstado(e.target.value as Mantenimiento["estado"])
              }
              className={inputClass}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En progreso</option>
              <option value="completado">Completado</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de inicio
            <input
              name="fecha_inicio"
              type="datetime-local"
              required
              defaultValue={fechaLocal(
                registro?.fecha_inicio ?? new Date().toISOString(),
              )}
              className={inputClass}
            />
          </label>
        </div>
        {estado === "completado" && (
          <label className="block text-sm font-medium text-gray-700">
            Fecha de finalización
            <input
              name="fecha_fin"
              type="datetime-local"
              defaultValue={
                registro?.fecha_fin ? fechaLocal(registro.fecha_fin) : ""
              }
              className={inputClass}
            />
            <span className="text-xs text-gray-500">
              Si la dejás vacía, se guarda la fecha actual.
            </span>
          </label>
        )}
        <label className="block text-sm font-medium text-gray-700">
          Descripción de la falla
          <textarea
            name="descripcion_falla"
            required
            rows={3}
            defaultValue={registro?.descripcion_falla ?? ""}
            className={inputClass}
            placeholder="¿Qué problema presenta el equipo?"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-gray-700">
            Responsable
            <input
              name="responsable"
              maxLength={255}
              defaultValue={registro?.responsable ?? ""}
              className={inputClass}
              placeholder="Nombre o taller"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Repuestos
            <input
              name="repuestos"
              maxLength={255}
              defaultValue={registro?.repuestos ?? ""}
              className={inputClass}
              placeholder="Componentes utilizados"
            />
          </label>
        </div>
        <label className="block text-sm font-medium text-gray-700">
          Observaciones
          <textarea
            name="observaciones"
            rows={2}
            defaultValue={registro?.observaciones ?? ""}
            className={inputClass}
          />
        </label>
        <p className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
          Los mantenimientos activos ponen el equipo en Mantenimiento. Al
          completar el último activo, el equipo vuelve a estar disponible.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border px-4 py-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
          >
            {loading ? "Guardando…" : "Guardar mantenimiento"}
          </button>
        </div>
      </fieldset>
    </form>
  );
};
