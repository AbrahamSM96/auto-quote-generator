import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, label, error, icon, type = "text", ...props }, ref) => {
		return (
			<div className="space-y-2">
				{label && (
					<label className="text-sm font-medium text-text-secondary uppercase tracking-wide">
						{label}
					</label>
				)}
				<div className="relative">
					{icon && (
						<div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
							{icon}
						</div>
					)}
					<input
						ref={ref}
						type={type}
						className={cn(
							"w-full px-4 py-3.5 bg-dark-elevated border border-dark-border rounded-xl",
							"text-text-primary placeholder:text-text-muted",
							"focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
							"hover:border-dark-border/80 transition-all",
							error &&
								"border-red-500 focus:ring-red-500/50 focus:border-red-500",
							icon && "pl-12",
							className,
						)}
						{...props}
					/>
				</div>
				{error && (
					<p className="text-red-400 text-sm flex items-center gap-2 animate-fade-in">
						<span>⚠️</span>
						{error}
					</p>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";
