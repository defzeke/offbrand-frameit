import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
	title: string;
	description: string;
	icon: LucideIcon;
	borderColor: string;
	iconColor: string;
}

export default function FeatureCard({
	title,
	description,
	icon: Icon,
	borderColor,
	iconColor,
}: FeatureCardProps) {
	return (
		<div 
			className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 relative overflow-hidden group"
			style={{ borderColor }}
		>
			{/* Animated background gradient on hover */}
			<div 
				className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
				style={{
					background: `linear-gradient(135deg, ${iconColor}20 0%, transparent 100%)`
				}}
			/>

			<div className="relative z-10">
				{/* Icon with background circle */}
				<div className="flex justify-center mb-6">
					<div 
						className="relative p-4 rounded-full group-hover:scale-110 transition-transform duration-300"
						style={{ 
							backgroundColor: `${iconColor}15`,
							boxShadow: `0 4px 20px ${iconColor}30`
						}}
					>
						<Icon 
							size={48} 
							style={{ color: iconColor }} 
							strokeWidth={1.5}
							className="group-hover:rotate-12 transition-transform duration-300" 
						/>
					</div>
				</div>

				<h3 className="text-2xl font-bold text-black mb-4 text-center">{title}</h3>
				<p className="text-gray-700 leading-relaxed text-center">
					{description}
				</p>
			</div>
		</div>
	);
}
