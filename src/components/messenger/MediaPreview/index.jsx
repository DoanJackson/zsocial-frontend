import { isVideoFile } from '../../../utils/messengerHelpers';

function MediaPreview({ files, onRemove }) {
    if (!files || files.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-2 px-4 pt-2">
            {files.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                    <div key={idx} className="relative group">
                        {isVideoFile(file) ? (
                            <video src={url} className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                        ) : (
                            <img src={url} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                        )}
                        <button
                            onClick={() => onRemove(idx)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs leading-none"
                        >
                            ×
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default MediaPreview;
