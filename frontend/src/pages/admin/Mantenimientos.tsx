import { useEffect, useState } from "react";
import {
  Plus,
  Wrench,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { Layout } from "../../components/layout/Layout";
import { Modal } from "../../components/common/Modal";
import { Toast } from "../../components/common/Toast";
import { MantenimientoForm } from "../../components/admin/MantenimientoForm";
import { mantenimientoService } from "../../services/mantenimientoService";
import { equipoService } from "../../services/equipoService";
import { getErrorMessage } from "../../utils/errorMessage";
import type { CrearMantenimiento, Equipo, Mantenimiento } from "../../types";

const estados = {
  pendiente: { label: "Pendiente", color: "bg-amber-100 text-amber-800" },
  en_progreso: { label: "En progreso", color: "bg-blue-100 text-blue-800" },
  completado: { label: "Completado", color: "bg-green-100 text-green-800" },
};
const fecha = (value: string | null) =>
  value
    ? new Date(value).toLocaleString("es-AR", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "Sin finalizar";

export const Mantenimientos = () => {
  const [registros, setRegistros] = useState<Mantenimiento[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Mantenimiento | null>(null);
  const [deleting, setDeleting] = useState<Mantenimiento | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [lista, inventario] = await Promise.all([
        mantenimientoService.getAll(),
        equipoService.getAll(),
      ]);
      setRegistros(lista);
      setEquipos(inventario);
    } catch (err) {
      const message = getErrorMessage(err, "No se pudieron cargar los mantenimientos");
      setError(message);
      setToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);

  const save = async (datos: CrearMantenimiento) => {
    setBusy(true);
    setToast(null);
    try {
      if (selected) {
        const { id_equipo: equipoId, ...cambios } = datos;
        void equipoId;
        await mantenimientoService.update(selected.id, cambios);
      } else await mantenimientoService.create(datos);
      setOpen(false);
      setToast({
        message: selected
          ? "Mantenimiento actualizado exitosamente"
          : "Mantenimiento creado exitosamente",
        type: "success",
      });
      await load();
    } catch (err) {
      setToast({ message: getErrorMessage(err, "No se pudo guardar el mantenimiento"), type: "error" });
    } finally {
      setBusy(false);
    }
  };
  const edit = async (id: number) => {
    setBusy(true);
    setToast(null);
    try {
      setSelected(await mantenimientoService.getById(id));
      setOpen(true);
    } catch (err) {
      setToast({ message: getErrorMessage(err, "No se pudo consultar el mantenimiento"), type: "error" });
    } finally {
      setBusy(false);
    }
  };
  const complete = async (id: number) => {
    setBusy(true);
    setToast(null);
    try {
      await mantenimientoService.patch(id, { estado: "completado" });
      setToast({ message: "Mantenimiento completado exitosamente", type: "success" });
      await load();
    } catch (err) {
      setToast({ message: getErrorMessage(err, "No se pudo completar el mantenimiento"), type: "error" });
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (!deleting) return;
    setBusy(true);
    setToast(null);
    try {
      await mantenimientoService.delete(deleting.id);
      setDeleting(null);
      setToast({ message: "Mantenimiento eliminado exitosamente", type: "success" });
      await load();
    } catch (err) {
      setToast({ message: getErrorMessage(err, "No se pudo eliminar el mantenimiento"), type: "error" });
    } finally {
      setBusy(false);
    }
  };
  const equipoNombre = (r: Mantenimiento) =>
    r.Equipo?.nombre ??
    equipos.find((e) => e.id === r.id_equipo)?.nombre ??
    `Equipo #${r.id_equipo}`;
  const visibles = registros.filter(
    (r) =>
      (!filter || r.estado === filter) &&
      `${equipoNombre(r)} ${r.descripcion_falla} ${r.responsable ?? ""} ${r.id}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Mantenimientos
            </h2>
            <p className="mt-1 text-gray-500">
              Seguimiento de fallas, reparaciones y disponibilidad de equipos.
            </p>
          </div>
          <button
            disabled={loading || busy}
            onClick={() => {
              setSelected(null);
              setToast(null);
              setOpen(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={18} />
            Nuevo mantenimiento
          </button>

        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {Object.entries(estados).map(([key, value]) => (
            <div key={key} className="rounded-xl border bg-white p-5">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${value.color}`}
              >
                {value.label}
              </span>
              <p className="mt-3 text-3xl font-semibold text-gray-900">
                {loading
                  ? "—"
                  : registros.filter((r) => r.estado === key).length}
              </p>
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border bg-white">
          <div className="flex flex-wrap gap-3 border-b p-4">
            <div className="relative min-w-48 flex-1">
              <Search
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                aria-label="Buscar mantenimientos"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar equipo, falla o responsable…"
                className="w-full rounded-lg border py-2 pl-10 pr-3"
              />
            </div>
            <select
              aria-label="Filtrar por estado"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border px-3 py-2"
            >
              <option value="">Todos los estados</option>
              {Object.entries(estados).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <p role="status" className="p-12 text-center text-gray-500">
              Cargando mantenimientos…
            </p>
          ) : visibles.length === 0 ? (
            <div className="p-12 text-center">
              <Wrench className="mx-auto mb-3 text-gray-400" size={32} />
              <p className="font-medium text-gray-700">
                {error
                  ? "No se pudo obtener la lista"
                  : registros.length
                    ? "No hay resultados para estos filtros"
                    : "Todavía no hay mantenimientos"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {error
                  ? "Recargá la página para reintentar."
                  : "Usá Nuevo mantenimiento para registrar una reparación."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    {[
                      "Equipo",
                      "Falla",
                      "Responsable",
                      "Fechas",
                      "Estado",
                      "Acciones",
                    ].map((label) => (
                      <th key={label} className="px-5 py-3 font-medium">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {visibles.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="max-w-xs px-5 py-4">
                        <p className="font-semibold text-gray-900">
                          {equipoNombre(r)}
                        </p>
                      </td>
                      <td className="max-w-xs px-5 py-4">
                        <p className="whitespace-pre-wrap break-words text-gray-600">
                          {r.descripcion_falla}
                        </p>
                        {r.repuestos && (
                          <p className="mt-1 text-xs text-gray-500">
                            Repuestos: {r.repuestos}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {r.responsable || "Sin asignar"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                        <p>{fecha(r.fecha_inicio)}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {fecha(r.fecha_fin)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${estados[r.estado]?.color ?? "bg-gray-100"}`}
                        >
                          {estados[r.estado]?.label ?? r.estado}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            disabled={busy}
                            onClick={() => void edit(r.id)}
                            aria-label={`Editar mantenimiento ${r.id}`}
                            title="Ver / editar"
                            className="rounded p-2 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                          >
                            <Pencil size={18} />
                          </button>
                          {r.estado !== "completado" && (
                            <button
                              disabled={busy}
                              onClick={() => void complete(r.id)}
                              aria-label={`Completar mantenimiento ${r.id}`}
                              title="Completar"
                              className="rounded p-2 text-green-600 hover:bg-green-50 disabled:opacity-50"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                          )}
                          <button
                            disabled={busy}
                            onClick={() => {
                              setDeleting(r);
                              setToast(null);
                            }}
                            aria-label={`Eliminar mantenimiento ${r.id}`}
                            title="Eliminar"
                            className="rounded p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <Modal
          isOpen={open}
          onClose={() => {
            if (!busy) setOpen(false);
          }}
          title={
            selected ? `Mantenimiento #${selected.id}` : "Nuevo mantenimiento"
          }
          size="lg"
        >
          <MantenimientoForm
            key={selected?.id ?? "nuevo"}
            registro={selected}
            equipos={equipos}
            loading={busy}
            onSubmit={save}
            onCancel={() => setOpen(false)}
          />
        </Modal>
        <Modal
          isOpen={!!deleting}
          onClose={() => {
            if (!busy) setDeleting(null);
          }}
          title="Eliminar mantenimiento"
          size="sm"
        >
          <p className="text-gray-600">
            ¿Eliminar el mantenimiento #{deleting?.id} de{" "}
            {deleting && equipoNombre(deleting)}? Esta acción elimina el
            registro.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              disabled={busy}
              onClick={() => setDeleting(null)}
              className="rounded-lg border px-4 py-2"
            >
              Cancelar
            </button>
            <button
              disabled={busy}
              onClick={() => void remove()}
              className="rounded-lg bg-red-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {busy ? "Eliminando…" : "Eliminar"}
            </button>
          </div>
        </Modal>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </Layout>
  );
};
