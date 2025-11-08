import { motion } from 'framer-motion';
import { useStore } from '../lib/store';
import { exportData, importData } from '../lib/db';
import { Button } from './ui/Button';
import { Download, Upload, Settings as SettingsIcon, Database, Lock } from 'lucide-react';

export function Settings() {
  const { showToast, loadUsers, loadSettings } = useStore();

  const handleExport = async () => {
    const data = await exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `knowledge-transfer-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully', 'success');
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importData(data);
      await loadUsers();
      await loadSettings();
      showToast('Data imported successfully', 'success');
    } catch (error) {
      showToast(`Import failed: ${error.message}`, 'error');
    }
    e.target.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-6 max-w-3xl"
    >
      <div className="space-y-8">
        <div className="gradient-border rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-blue-500" />
            AI Configuration
          </h2>

          <div className="space-y-5">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-300 font-medium mb-1">Credal AI Integration</p>
                <p className="text-xs text-gray-400">
                  Powered by ACF&apos;s secure Credal instance with pre-configured agent
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">API Endpoint</label>
              <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 font-mono text-sm">
                https://app.credal.acf.gov/api/v0/copilots/sendMessage
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Agent ID</label>
              <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 font-mono text-sm">
                85f84a9a-a00f-11f0-bae0-fb5a99a14972
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Authentication</label>
              <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 font-mono text-sm">
                Bearer Token (Managed by ACF IT)
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <div className="px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 font-medium text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Connected
              </div>
            </div>
          </div>
        </div>

        <div className="gradient-border rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Database className="w-7 h-7 text-purple-500" />
            Data Management
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleExport} variant="secondary" className="flex-1">
              <Download className="w-5 h-5 mr-2" />
              Export Data
            </Button>
            <label className="flex-1">
              <input type="file" accept=".json" onChange={handleImport} className="sr-only" />
              <Button as="span" variant="secondary" className="w-full">
                <Upload className="w-5 h-5 mr-2" />
                Import Data
              </Button>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
