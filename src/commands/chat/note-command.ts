import { AddUndefinedToPossiblyUndefinedPropertiesOfInterface } from 'discord-api-types/utils/internals.js';
import {
    APIApplicationCommandOptionChoice,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { CommandInteraction, MessageEmbed, PermissionString } from 'discord.js';

import { Lang } from '../../services/index.js';
import { InteractionUtils } from '../../utils/index.js';
import { Command, CommandDeferType } from '../index.js';
import { NotesConfig } from './notes.js';

export class NoteCommand implements Command {
    public metadata: RESTPostAPIChatInputApplicationCommandsJSONBody = {
        type: ApplicationCommandType.ChatInput,
        name: Lang.getCom('chatCommands.note'),
        description: Lang.getRef('commandDescs.note', Lang.Default),
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: Lang.getCom('arguments.note'),
                required: true,
                description: Lang.getRef('argumentDescs.note', Lang.Default),
                choices: this.notes(),
            },
        ],
    };
    private notes(): AddUndefinedToPossiblyUndefinedPropertiesOfInterface<
        APIApplicationCommandOptionChoice<string>
    >[] {
        let choices: AddUndefinedToPossiblyUndefinedPropertiesOfInterface<
            APIApplicationCommandOptionChoice<string>
        >[] = [];
        for (const key in NotesConfig.notes) {
            choices.push({
                name: NotesConfig.notes[key].name,
                value: key,
            });
        }
        return choices;
    }
    public deferType = CommandDeferType.PUBLIC;
    public requireClientPerms: PermissionString[] = [];
    public async execute(intr: CommandInteraction): Promise<void> {
        let option = intr.options.getString(Lang.getCom('arguments.note'));

        let embed: MessageEmbed;
        embed = new MessageEmbed({
            title: NotesConfig.notes[option].name,
            description: NotesConfig.notes[option].answer,
        });

        await InteractionUtils.send(intr, embed);
    }
}
