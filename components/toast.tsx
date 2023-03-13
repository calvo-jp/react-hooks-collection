import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { normalizeProps, useActor, useMachine } from "@zag-js/react";
import * as toast from "@zag-js/toast";
import clsx from "clsx";
import { NextPage } from "next";
import { createContext, PropsWithChildren, useContext, useId } from "react";

type Nullable<T> = T | null;

type ToastProps = {
  actor: toast.Service;
};

function Toast(props: ToastProps) {
  const [state, send] = useActor(props.actor);

  const api = toast.connect(state, send, normalizeProps);

  return (
    <div
      className={clsx(
        "flex w-full animate-fadeout items-center gap-3 rounded-md border p-4 will-change-[opacity] data-[open]:animate-fadein md:w-[unset] md:min-w-[375px] md:max-w-[500px]",
        api.type === "error" && "border-red-300 bg-red-100",
        api.type === "success" && "border-green-300 bg-green-100",
      )}
      aria-label={api.description}
      {...api.rootProps}
    >
      <div>{getToastIcon(api.type)}</div>

      <div className="grow">
        <p
          className={clsx(
            "text-sm",
            api.type === "success" && "text-green-900",
            api.type === "error" && "text-red-900",
          )}
          {...api.descriptionProps}
        >
          {api.description}
        </p>
      </div>

      <button
        className={clsx(
          "rounded-md p-0.5 transition-all duration-300 hover:bg-black hover:bg-opacity-5",
          api.type === "success" && "text-green-600",
          api.type === "error" && "text-red-600",
        )}
        tabIndex={-1}
        onClick={api.dismiss}
        aria-label="Close notification"
      >
        <span className="sr-only">Close notification</span>
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

function getToastIcon(type: toast.Type) {
  switch (type) {
    case "error":
      return <ExclamationCircleIcon className="h-5 w-5 fill-red-500" />;
    default:
      return <CheckCircleIcon className="h-5 w-5 fill-green-500" />;
  }
}

/* TODO: populate with type from lib once avail */
type ContextSchema = typeof toast.group.connect;

const ToastContext = createContext<ReturnType<ContextSchema>>({
  count: 0,
  create(..._: unknown[]) {
    return "";
  },
  error(..._: unknown[]) {
    return "";
  },
  success(..._: unknown[]) {
    return "";
  },
  getGroupProps() {
    return {};
  },
  isVisible() {
    return false;
  },
  dismiss() {},
  dismissByPlacement() {},
  loading(..._: unknown[]) {
    return "";
  },
  pause() {},
  remove() {},
  resume() {},
  async promise(...args: any) {
    return args[0](args[1]);
  },
  subscribe(..._: unknown[]) {
    return function unsubscribe() {};
  },
  toasts: [],
  toastsByPlacement: {},
  update(..._: unknown[]) {
    return "";
  },
  upsert(..._: unknown[]) {
    return "";
  },
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: PropsWithChildren) {
  const id = useId();

  const [state, send] = useMachine(
    toast.group.machine({
      id,
      max: 5,
      gutter: "0.6rem",
      offsets: "0.75rem",
      pauseOnPageIdle: true,
      pauseOnInteraction: true,
    }),
  );

  const api = toast.group.connect(state, send, normalizeProps);

  return (
    <ToastContext.Provider value={api}>
      {Object.entries(api.toastsByPlacement).map((args) => {
        const placement = args[0] as toast.Placement;
        const toasts = args[1];

        return (
          <div key={placement} {...api.getGroupProps({ placement })}>
            {toasts.map((toast) => (
              <Toast key={toast.id} actor={toast} />
            ))}
          </div>
        );
      })}

      {children}
    </ToastContext.Provider>
  );
}

type D = Record<string, unknown>;
type C<T extends D> = ((props: T) => Nullable<JSX.Element>) | NextPage;

export function withToast<T extends D>(Component: C<T>) {
  return function WrappedComponent(props: T) {
    return (
      <ToastProvider>
        <Component {...props} />
      </ToastProvider>
    );
  };
}
