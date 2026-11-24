"use client";

import type { openInteractions } from "eve/events";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemFooter,
	ItemTitle,
} from "@/components/ui/item";

type OpenInteraction = ReturnType<typeof openInteractions>[number];

export type InteractionAnswer =
	| { interactionId: string; optionId: string }
	| { interactionId: string; text: string };

function InteractionPrompt({
	interaction: { interactionId, request },
	onAnswer,
}: {
	interaction: OpenInteraction;
	onAnswer: (answer: InteractionAnswer) => void;
}) {
	const titleId = useId();
	const replyId = useId();
	return (
		<Item
			variant="outline"
			role="group"
			aria-labelledby={titleId}
			className="items-start"
		>
			<ItemContent>
				<ItemTitle id={titleId}>{request.prompt}</ItemTitle>
			</ItemContent>
			{request.options && request.options.length > 0 && (
				<ItemActions className="basis-full flex-wrap">
					{request.options.map((option) => (
						<Button
							key={option.id}
							variant="outline"
							onClick={() => onAnswer({ interactionId, optionId: option.id })}
						>
							{option.label}
						</Button>
					))}
				</ItemActions>
			)}
			{request.allowFreeform && (
				<ItemFooter>
					<form
						className="flex w-full flex-wrap items-end gap-2"
						onSubmit={(event) => {
							event.preventDefault();
							const text = String(
								new FormData(event.currentTarget).get("reply") ?? "",
							).trim();
							if (text) onAnswer({ interactionId, text });
						}}
					>
						<div className="min-w-48 flex-1 space-y-1.5">
							<label htmlFor={replyId} className="text-sm">
								Your reply
							</label>
							<Input id={replyId} name="reply" required />
						</div>
						<Button type="submit">Send reply</Button>
					</form>
				</ItemFooter>
			)}
		</Item>
	);
}

/** Questions the agent is waiting on a person to answer. */
export function Interactions({
	interactions,
	onAnswer,
}: {
	interactions: readonly OpenInteraction[];
	onAnswer: (answer: InteractionAnswer) => void;
}) {
	return interactions.map((interaction) => (
		<InteractionPrompt
			key={interaction.interactionId}
			interaction={interaction}
			onAnswer={onAnswer}
		/>
	));
}
