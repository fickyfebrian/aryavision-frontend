import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import type { RetrainResult } from '../hooks/use-retrain-model';
import { useRetrainModel } from '../hooks/use-retrain-model';

interface RetrainModelDialogProps {
  open: boolean;
  onClose: () => void;
}

type DialogStep = 'confirm' | 'clustering' | 'cbf' | 'success' | 'error';

export const RetrainModelDialog = ({ open, onClose }: RetrainModelDialogProps) => {
  const [step, setStep] = useState<DialogStep>('confirm');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<RetrainResult | null>(null);

  const retrainMutation = useRetrainModel();

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setStep('confirm');
      setErrorMessage('');
      setResult(null);
      retrainMutation.reset();
    }
  }, [open]);

  const handleStart = async () => {
    try {
      setStep('clustering');
      
      const res = await retrainMutation.mutateAsync((currentStep) => {
        setStep(currentStep);
      });
      
      setResult(res);
      setStep('success');
    } catch (error: any) {
      setStep('error');
      setErrorMessage(error?.response?.data?.message || error.message || 'An unexpected error occurred.');
    }
  };

  const handleClose = () => {
    // Prevent closing while loading
    if (step === 'clustering' || step === 'cbf') return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      {/* CONFIRMATION STATE */}
      {step === 'confirm' && (
        <>
          <DialogTitle className="font-bold border-b border-gray-100">
            Retrain Recommendation Model
          </DialogTitle>
          <DialogContent className="pt-6">
            <Typography variant="body1" className="mb-4">
              Retraining will execute:
            </Typography>
            <Box className="flex flex-col gap-2 mb-6 ml-2 text-gray-700">
              <div className="flex items-center gap-2"><CheckCircleIcon color="success" fontSize="small" /> Data Preprocessing</div>
              <div className="flex items-center gap-2"><CheckCircleIcon color="success" fontSize="small" /> Feature Extraction</div>
              <div className="flex items-center gap-2"><CheckCircleIcon color="success" fontSize="small" /> MinMax Scaling</div>
              <div className="flex items-center gap-2"><CheckCircleIcon color="success" fontSize="small" /> K-Means Clustering</div>
              <div className="flex items-center gap-2"><CheckCircleIcon color="success" fontSize="small" /> Update Product Clusters</div>
              <div className="flex items-center gap-2"><CheckCircleIcon color="success" fontSize="small" /> Rebuild Content-Based Filtering Similarity Matrix</div>
            </Box>
            <Typography variant="body2" className="text-gray-600 bg-blue-50 p-3 rounded-md">
              <strong>Estimated duration:</strong> Less than 1 second.
              <br />
              This operation is safe and will update the recommendation engine using the latest products.
            </Typography>
          </DialogContent>
          <DialogActions className="p-4 pt-0">
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleStart} variant="contained" color="primary" disableElevation>
              Start Retraining
            </Button>
          </DialogActions>
        </>
      )}

      {/* LOADING STATES */}
      {(step === 'clustering' || step === 'cbf') && (
        <>
          <DialogTitle className="font-bold border-b border-gray-100">
            Retraining in Progress...
          </DialogTitle>
          <DialogContent className="pt-8 pb-8 flex flex-col items-center">
            <CircularProgress size={48} className="mb-6" />
            <Box className="w-full max-w-sm flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {step === 'cbf' ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CircularProgress size={24} />
                )}
                <Typography className={step === 'clustering' ? 'font-medium' : 'text-gray-500'}>
                  Updating Product Clusters...
                </Typography>
              </div>
              
              <div className="flex items-center gap-3">
                {step === 'cbf' ? (
                  <CircularProgress size={24} />
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-200 rounded-full" />
                )}
                <Typography className={step === 'cbf' ? 'font-medium' : 'text-gray-500'}>
                  Building Recommendation Engine...
                </Typography>
              </div>
            </Box>
          </DialogContent>
        </>
      )}

      {/* SUCCESS STATE */}
      {step === 'success' && result && (
        <>
          <DialogTitle className="font-bold border-b border-gray-100 flex items-center gap-2 text-green-700">
            <CheckCircleIcon color="success" /> Model Updated Successfully
          </DialogTitle>
          <DialogContent className="pt-6">
            <Box className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col gap-2">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <Typography variant="body2" className="text-gray-600">Products Processed:</Typography>
                <Typography variant="body2" className="font-medium">{result.clustering.data.total_product_processed}</Typography>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-2">
                <Typography variant="body2" className="text-gray-600">Total Clusters:</Typography>
                <Typography variant="body2" className="font-medium">{result.clustering.data.total_clusters}</Typography>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-2">
                <Typography variant="body2" className="text-gray-600">Similarity Matrix Generated:</Typography>
                <Typography variant="body2" className="font-medium">{result.cbf.data.similarity_shape.join(' × ')}</Typography>
              </div>
              <div className="flex justify-between pt-2">
                <Typography variant="body2" className="text-gray-600">Total Duration:</Typography>
                <Typography variant="body2" className="font-medium text-green-600">{result.durationMs} ms</Typography>
              </div>
            </Box>
          </DialogContent>
          <DialogActions className="p-4 pt-0">
            <Button onClick={handleClose} variant="contained" color="primary" disableElevation>
              Done
            </Button>
          </DialogActions>
        </>
      )}

      {/* ERROR STATE */}
      {step === 'error' && (
        <>
          <DialogTitle className="font-bold border-b border-gray-100 flex items-center gap-2 text-red-700">
            <ErrorIcon color="error" /> Retraining Failed
          </DialogTitle>
          <DialogContent className="pt-6">
            <Typography variant="body1" className="mb-2">
              An error occurred during the retraining process:
            </Typography>
            <Box className="bg-red-50 text-red-700 p-3 rounded-md font-mono text-sm break-words">
              {errorMessage}
            </Box>
          </DialogContent>
          <DialogActions className="p-4 pt-0">
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleStart} variant="contained" color="primary" disableElevation>
              Retry
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
