async function exportData() {
    const data = localStorage.getItem(Storage.KEY);

    if (!data) {
        alert('No data to export');
        return;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const fileName = 'bullion_pro_backup.json';

    // Check if running in Capacitor native
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        try {
            const { Filesystem, Directory } = await import('@capacitor/filesystem');
            const base64 = await blobToBase64(blob);
            await Filesystem.writeFile({
                path: fileName,
                data: base64,
                directory: Directory.Documents,  // Saves to Documents folder
                recursive: false
            });
            alert(`Backup saved to Documents/${fileName}`);
        } catch (error) {
            console.error('Export failed', error);
            alert('Export failed: ' + error.message);
        }
    } else {
        // Fallback to web method
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Helper: Convert Blob to base64
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
