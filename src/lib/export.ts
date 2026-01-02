
export function exportToCSV<T extends Record<string, any>>(data: T[], filename: string) {
    if (!data || data.length === 0) {
        return;
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        headers.join(','), // Header row
        ...data.map(row =>
            headers.map(fieldName => {
                // Handle strings with commas or quotes
                const value = row[fieldName]?.toString() || '';
                return `"${value.replace(/"/g, '""')}"`;
            }).join(',')
        )
    ].join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
