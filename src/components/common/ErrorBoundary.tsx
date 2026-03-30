// ============================================================
// ORION — Composant : ErrorBoundary
// Capture les erreurs React et affiche un fallback propre
// ============================================================

import { Component, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // TODO: Envoyer l'erreur à un service de monitoring (Sentry, etc.)
        console.error("[ORION ErrorBoundary]", error, info);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="flex items-center justify-center min-h-[200px] p-4">
                    <Card className="max-w-md w-full">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-destructive" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-sm">Une erreur est survenue</h3>
                                {this.state.error?.message && (
                                    <p className="text-xs text-muted-foreground font-mono">
                                        {this.state.error.message}
                                    </p>
                                )}
                            </div>
                            <Button size="sm" variant="outline" onClick={this.handleReset}>
                                Réessayer
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
