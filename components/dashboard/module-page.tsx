type ModulePageProps = {
    title: string;
    description: string;
};

export function ModulePage({ title, description }: ModulePageProps) {
    return (
        <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-2 text-center">
            <h1 className="text-4xl font-bold text-primary">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}
